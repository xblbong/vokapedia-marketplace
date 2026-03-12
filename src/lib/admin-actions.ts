"use server";

import { prisma } from "@/src/lib/prisma";
import { requireAuth, requireAdmin, hashPassword } from "@/src/lib/auth";
import { revalidatePath } from "next/cache";

// ==================== PRODUCTS ====================

export async function createProduct(formData: FormData) {
    await requireAuth();
    const data = {
        title: formData.get("title") as string,
        description: formData.get("description") as string || "",
        price: parseFloat(formData.get("price") as string) || 0,
        stock: parseInt(formData.get("stock") as string) || 0,
        image: formData.get("image") as string || "",
        startupId: parseInt(formData.get("startupId") as string),
        categoryId: parseInt(formData.get("categoryId") as string),
    };
    await prisma.product.create({ data });
    revalidatePath("/admin/products");
}

export async function updateProduct(id: number, formData: FormData) {
    await requireAuth();
    const data = {
        title: formData.get("title") as string,
        description: formData.get("description") as string || "",
        price: parseFloat(formData.get("price") as string) || 0,
        stock: parseInt(formData.get("stock") as string) || 0,
        image: formData.get("image") as string || "",
        startupId: parseInt(formData.get("startupId") as string),
        categoryId: parseInt(formData.get("categoryId") as string),
    };
    await prisma.product.update({ where: { id }, data });
    revalidatePath("/admin/products");
}

export async function deleteProduct(id: number) {
    await requireAuth();
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
}

// ==================== STARTUPS ====================

export async function createStartup(formData: FormData) {
    await requireAuth();
    const name = formData.get("name") as string;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const data = {
        name,
        slug,
        description: formData.get("description") as string || "",
        bannerImage: formData.get("bannerImage") as string || "",
        profileImage: formData.get("profileImage") as string || "",
        programStudiId: parseInt(formData.get("programStudiId") as string),
    };
    await prisma.startup.create({ data });
    revalidatePath("/admin/startups");
}

export async function updateStartup(id: number, formData: FormData) {
    await requireAuth();
    const name = formData.get("name") as string;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    await prisma.startup.update({
        where: { id },
        data: {
            name,
            slug,
            description: formData.get("description") as string || "",
            bannerImage: formData.get("bannerImage") as string || "",
            profileImage: formData.get("profileImage") as string || "",
            programStudiId: parseInt(formData.get("programStudiId") as string),
        },
    });
    revalidatePath("/admin/startups");
}

export async function deleteStartup(id: number) {
    await requireAuth();
    await prisma.startup.delete({ where: { id } });
    revalidatePath("/admin/startups");
}

// ==================== TEAM MEMBERS ====================

export async function createTeamMember(formData: FormData) {
    await requireAuth();
    await prisma.teamMember.create({
        data: {
            name: formData.get("name") as string,
            role: formData.get("role") as string,
            photo: formData.get("photo") as string || "",
            instagramUrl: (formData.get("instagramUrl") as string) || null,
            startupId: parseInt(formData.get("startupId") as string),
        },
    });
    revalidatePath("/admin/startups");
}

export async function deleteTeamMember(id: number) {
    await requireAuth();
    await prisma.teamMember.delete({ where: { id } });
    revalidatePath("/admin/startups");
}

// ==================== CATEGORIES ====================

export async function createCategory(formData: FormData) {
    await requireAuth();
    await prisma.category.create({ data: { name: formData.get("name") as string } });
    revalidatePath("/admin/categories");
}

export async function updateCategory(id: number, formData: FormData) {
    await requireAuth();
    await prisma.category.update({ where: { id }, data: { name: formData.get("name") as string } });
    revalidatePath("/admin/categories");
}

export async function deleteCategory(id: number) {
    await requireAuth();
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
}

// ==================== PROGRAM STUDI ====================

export async function createProgramStudi(formData: FormData) {
    await requireAuth();
    await prisma.programStudi.create({
        data: {
            name: formData.get("name") as string,
            description: formData.get("description") as string || "",
            icon: formData.get("icon") as string || "",
        },
    });
    revalidatePath("/admin/program-studi");
}

export async function updateProgramStudi(id: number, formData: FormData) {
    await requireAuth();
    await prisma.programStudi.update({
        where: { id },
        data: {
            name: formData.get("name") as string,
            description: formData.get("description") as string || "",
            icon: formData.get("icon") as string || "",
        },
    });
    revalidatePath("/admin/program-studi");
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

    const email = formData.get("email") as string;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { error: "Email sudah terdaftar" };

    const password = await hashPassword(formData.get("password") as string);
    await prisma.user.create({
        data: {
            name: formData.get("name") as string,
            email,
            password,
            role: (formData.get("role") as string) === "ADMINISTRATOR" ? "ADMINISTRATOR" : "SUPERVISOR",
        },
    });
    revalidatePath("/admin/users");
    return { success: true };
}

export async function deleteUser(id: number) {
    const adminCheck = await requireAdmin();
    if ("error" in adminCheck) return adminCheck;

    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin/users");
    return { success: true };
}
