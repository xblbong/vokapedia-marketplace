"use server";

import { prisma } from "@/src/lib/prisma";
import { requireAuth, requireAdmin, hashPassword } from "@/src/lib/auth";
import { revalidatePath } from "next/cache";
import { checkIdempotency, storeIdempotency } from "@/src/lib/idempotency";

// ==================== HELPERS ====================

function parseRupiah(value: string): number {
    if (!value) return 0;
    // Strip "Rp", dots, spaces → parse as number
    const cleaned = value.replace(/[Rp.\s]/g, "").replace(/,/g, ".");
    return parseFloat(cleaned) || 0;
}

function countWords(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length;
}

// ==================== PRODUCTS ====================

export async function createProduct(formData: FormData) {
    await requireAuth();

    // Idempotency check
    const idempotencyKey = formData.get("idempotencyKey") as string | null;
    const { isDuplicate, cachedResult } = checkIdempotency(idempotencyKey);
    if (isDuplicate) return cachedResult;

    const title = (formData.get("title") as string || "").trim();
    const description = (formData.get("description") as string || "").trim();
    const priceRaw = (formData.get("price") as string || "0");
    const stockRaw = (formData.get("stock") as string || "0");
    const image = (formData.get("image") as string || "");
    const ecommerceUrlRaw = (formData.get("ecommerceUrl") as string || "").trim();
    const startupId = parseInt(formData.get("startupId") as string);
    const categoryId = parseInt(formData.get("categoryId") as string);

    // Validation
    const errors: string[] = [];
    if (!title) errors.push("Nama produk wajib diisi");
    if (countWords(description) < 10) errors.push("Deskripsi produk minimal 10 kata");
    const price = parseRupiah(priceRaw);
    if (price <= 0) errors.push("Harga harus lebih dari 0");
    const stock = parseInt(stockRaw) || 0;
    if (stock < 1) errors.push("Stok minimal 1");
    if (!startupId || isNaN(startupId)) errors.push("Startup wajib dipilih");
    if (!categoryId || isNaN(categoryId)) errors.push("Kategori wajib dipilih");
    if (!ecommerceUrlRaw) {
        errors.push("Link E-commerce wajib diisi");
    } else {
        try {
            new URL(ecommerceUrlRaw);
        } catch {
            errors.push("Link E-commerce harus berupa URL yang valid (contoh: https://tokomu.com/produk)");
        }
    }

    if (errors.length > 0) {
        const result = { error: errors.join(". ") };
        return result;
    }

    const data = {
        title,
        description,
        price,
        stock,
        image,
        ecommerceUrl: ecommerceUrlRaw,
        startupId,
        categoryId,
    };

    await prisma.product.create({ data });
    const result = { success: true };
    storeIdempotency(idempotencyKey, result);
    revalidatePath("/admin/products");
    return result;
}

export async function updateProduct(id: number, formData: FormData) {
    await requireAuth();

    const idempotencyKey = formData.get("idempotencyKey") as string | null;
    const { isDuplicate, cachedResult } = checkIdempotency(idempotencyKey);
    if (isDuplicate) return cachedResult;

    const title = (formData.get("title") as string || "").trim();
    const description = (formData.get("description") as string || "").trim();
    const priceRaw = (formData.get("price") as string || "0");
    const stockRaw = (formData.get("stock") as string || "0");
    const image = (formData.get("image") as string || "");
    const ecommerceUrlRaw = (formData.get("ecommerceUrl") as string || "").trim();
    const startupId = parseInt(formData.get("startupId") as string);
    const categoryId = parseInt(formData.get("categoryId") as string);

    // Validation
    const errors: string[] = [];
    if (!title) errors.push("Nama produk wajib diisi");
    if (countWords(description) < 10) errors.push("Deskripsi produk minimal 10 kata");
    const price = parseRupiah(priceRaw);
    if (price <= 0) errors.push("Harga harus lebih dari 0");
    const stock = parseInt(stockRaw) || 0;
    if (stock < 1) errors.push("Stok minimal 1");
    if (!ecommerceUrlRaw) {
        errors.push("Link E-commerce wajib diisi");
    } else {
        try {
            new URL(ecommerceUrlRaw);
        } catch {
            errors.push("Link E-commerce harus berupa URL yang valid (contoh: https://tokomu.com/produk)");
        }
    }

    if (errors.length > 0) return { error: errors.join(". ") };

    const data = {
        title,
        description,
        price,
        stock,
        image,
        ecommerceUrl: ecommerceUrlRaw,
        startupId,
        categoryId,
    };

    await prisma.product.update({ where: { id }, data });
    const result = { success: true };
    storeIdempotency(idempotencyKey, result);
    revalidatePath("/admin/products");
    return result;
}

export async function deleteProduct(id: number) {
    await requireAuth();
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
}

// ==================== STARTUPS ====================

export async function createStartup(formData: FormData) {
    await requireAuth();

    const idempotencyKey = formData.get("idempotencyKey") as string | null;
    const { isDuplicate, cachedResult } = checkIdempotency(idempotencyKey);
    if (isDuplicate) return cachedResult;

    const name = (formData.get("name") as string || "").trim();
    const description = (formData.get("description") as string || "").trim();
    const bannerImage = formData.get("bannerImage") as string || "";
    const profileImage = formData.get("profileImage") as string || "";
    const programStudiId = parseInt(formData.get("programStudiId") as string);

    // Team members from JSON
    const teamMembersJson = formData.get("teamMembers") as string || "[]";
    let teamMembers: { name: string; role: string; photo: string; instagramUrl: string }[] = [];
    try {
        teamMembers = JSON.parse(teamMembersJson);
    } catch {
        return { error: "Data anggota tim tidak valid" };
    }

    // Validation
    const errors: string[] = [];
    if (!name) errors.push("Nama startup wajib diisi");
    if (!description) errors.push("Deskripsi wajib diisi");
    if (!programStudiId || isNaN(programStudiId)) errors.push("Program Studi wajib dipilih");
    if (teamMembers.length < 1) errors.push("Minimal harus ada 1 anggota tim");

    for (let i = 0; i < teamMembers.length; i++) {
        if (!teamMembers[i].name?.trim()) errors.push(`Nama anggota tim ke-${i + 1} wajib diisi`);
        if (!teamMembers[i].role?.trim()) errors.push(`Peran anggota tim ke-${i + 1} wajib diisi`);
    }

    if (errors.length > 0) return { error: errors.join(". ") };

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const startup = await prisma.startup.create({
        data: {
            name,
            slug,
            description,
            bannerImage,
            profileImage,
            programStudiId,
            teamMembers: {
                create: teamMembers.map((m) => ({
                    name: m.name.trim(),
                    role: m.role.trim(),
                    photo: m.photo || "",
                    instagramUrl: m.instagramUrl || null,
                })),
            },
        },
    });

    const result = { success: true, id: startup.id };
    storeIdempotency(idempotencyKey, result);
    revalidatePath("/admin/startups");
    return result;
}

export async function updateStartup(id: number, formData: FormData) {
    await requireAuth();

    const idempotencyKey = formData.get("idempotencyKey") as string | null;
    const { isDuplicate, cachedResult } = checkIdempotency(idempotencyKey);
    if (isDuplicate) return cachedResult;

    const name = (formData.get("name") as string || "").trim();
    const description = (formData.get("description") as string || "").trim();
    const bannerImage = formData.get("bannerImage") as string || "";
    const profileImage = formData.get("profileImage") as string || "";
    const programStudiId = parseInt(formData.get("programStudiId") as string);

    const errors: string[] = [];
    if (!name) errors.push("Nama startup wajib diisi");
    if (!description) errors.push("Deskripsi wajib diisi");
    if (!programStudiId || isNaN(programStudiId)) errors.push("Program Studi wajib dipilih");
    if (errors.length > 0) return { error: errors.join(". ") };

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    await prisma.startup.update({
        where: { id },
        data: {
            name,
            slug,
            description,
            bannerImage,
            profileImage,
            programStudiId,
        },
    });

    const result = { success: true };
    storeIdempotency(idempotencyKey, result);
    revalidatePath("/admin/startups");
    return result;
}

export async function deleteStartup(id: number) {
    await requireAuth();
    await prisma.startup.delete({ where: { id } });
    revalidatePath("/admin/startups");
}

// ==================== TEAM MEMBERS ====================

export async function createTeamMember(formData: FormData) {
    await requireAuth();

    const idempotencyKey = formData.get("idempotencyKey") as string | null;
    const { isDuplicate, cachedResult } = checkIdempotency(idempotencyKey);
    if (isDuplicate) return cachedResult;

    const name = (formData.get("name") as string || "").trim();
    const role = (formData.get("role") as string || "").trim();
    const photo = formData.get("photo") as string || "";
    const instagramUrl = (formData.get("instagramUrl") as string) || null;
    const startupId = parseInt(formData.get("startupId") as string);

    const errors: string[] = [];
    if (!name) errors.push("Nama anggota wajib diisi");
    if (!role) errors.push("Peran anggota wajib diisi");
    if (!startupId || isNaN(startupId)) errors.push("Startup wajib dipilih");
    if (errors.length > 0) return { error: errors.join(". ") };

    await prisma.teamMember.create({
        data: { name, role, photo, instagramUrl, startupId },
    });

    const result = { success: true };
    storeIdempotency(idempotencyKey, result);
    revalidatePath("/admin/startups");
    return result;
}

export async function deleteTeamMember(id: number) {
    await requireAuth();
    await prisma.teamMember.delete({ where: { id } });
    revalidatePath("/admin/startups");
}

// ==================== CATEGORIES ====================

export async function createCategory(formData: FormData) {
    await requireAuth();

    const idempotencyKey = formData.get("idempotencyKey") as string | null;
    const { isDuplicate, cachedResult } = checkIdempotency(idempotencyKey);
    if (isDuplicate) return cachedResult;

    const name = (formData.get("name") as string || "").trim();
    if (!name) return { error: "Nama kategori wajib diisi" };

    // Unique check
    const existing = await prisma.category.findFirst({
        where: { name: { equals: name, mode: "insensitive" } },
    });
    if (existing) return { error: "Nama kategori sudah terdaftar." };

    await prisma.category.create({ data: { name } });
    const result = { success: true };
    storeIdempotency(idempotencyKey, result);
    revalidatePath("/admin/categories");
    return result;
}

export async function updateCategory(id: number, formData: FormData) {
    await requireAuth();

    const idempotencyKey = formData.get("idempotencyKey") as string | null;
    const { isDuplicate, cachedResult } = checkIdempotency(idempotencyKey);
    if (isDuplicate) return cachedResult;

    const name = (formData.get("name") as string || "").trim();
    if (!name) return { error: "Nama kategori wajib diisi" };

    // Unique check (exclude current)
    const existing = await prisma.category.findFirst({
        where: {
            name: { equals: name, mode: "insensitive" },
            id: { not: id },
        },
    });
    if (existing) return { error: "Nama kategori sudah terdaftar." };

    await prisma.category.update({ where: { id }, data: { name } });
    const result = { success: true };
    storeIdempotency(idempotencyKey, result);
    revalidatePath("/admin/categories");
    return result;
}

export async function deleteCategory(id: number) {
    await requireAuth();
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
}

// ==================== PROGRAM STUDI ====================

export async function createProgramStudi(formData: FormData) {
    await requireAuth();

    const idempotencyKey = formData.get("idempotencyKey") as string | null;
    const { isDuplicate, cachedResult } = checkIdempotency(idempotencyKey);
    if (isDuplicate) return cachedResult;

    const name = (formData.get("name") as string || "").trim();
    const description = (formData.get("description") as string || "").trim();
    const icon = formData.get("icon") as string || "";

    if (!name) return { error: "Nama program studi wajib diisi" };

    await prisma.programStudi.create({ data: { name, description, icon } });
    const result = { success: true };
    storeIdempotency(idempotencyKey, result);
    revalidatePath("/admin/program-studi");
    return result;
}

export async function updateProgramStudi(id: number, formData: FormData) {
    await requireAuth();

    const idempotencyKey = formData.get("idempotencyKey") as string | null;
    const { isDuplicate, cachedResult } = checkIdempotency(idempotencyKey);
    if (isDuplicate) return cachedResult;

    const name = (formData.get("name") as string || "").trim();
    const description = (formData.get("description") as string || "").trim();
    const icon = formData.get("icon") as string || "";

    if (!name) return { error: "Nama program studi wajib diisi" };

    await prisma.programStudi.update({
        where: { id },
        data: { name, description, icon },
    });
    const result = { success: true };
    storeIdempotency(idempotencyKey, result);
    revalidatePath("/admin/program-studi");
    return result;
}

export async function deleteProgramStudi(id: number) {
    await requireAuth();
    await prisma.programStudi.delete({ where: { id } });
    revalidatePath("/admin/program-studi");
}

// ==================== USERS ====================

export async function createUser(formData: FormData) {
    const adminCheck = await requireAdmin();
    if ("error" in adminCheck) return adminCheck;

    const idempotencyKey = formData.get("idempotencyKey") as string | null;
    const { isDuplicate, cachedResult } = checkIdempotency(idempotencyKey);
    if (isDuplicate) return cachedResult;

    const name = (formData.get("name") as string || "").trim();
    const email = (formData.get("email") as string || "").trim();
    const passwordRaw = formData.get("password") as string || "";
    const roleRaw = formData.get("role") as string || "";

    // Validation
    const errors: string[] = [];
    if (name.length < 7) errors.push("Username minimal 7 karakter");
    if (!email) errors.push("Email wajib diisi");
    if (!passwordRaw) errors.push("Password wajib diisi");
    if (!roleRaw) errors.push("Role wajib dipilih");
    if (errors.length > 0) return { error: errors.join(". ") };

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { error: "Email sudah terdaftar" };

    const password = await hashPassword(passwordRaw);
    await prisma.user.create({
        data: {
            name,
            email,
            password,
            role: roleRaw === "ADMINISTRATOR" ? "ADMINISTRATOR" : "SUPERVISOR",
        },
    });
    const result = { success: true };
    storeIdempotency(idempotencyKey, result);
    revalidatePath("/admin/users");
    return result;
}

export async function deleteUser(id: number) {
    const adminCheck = await requireAdmin();
    if ("error" in adminCheck) return adminCheck;

    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin/users");
    return { success: true };
}
