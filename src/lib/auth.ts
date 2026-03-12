"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/src/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ==================== PASSWORD ====================

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

// ==================== SESSION (Cookie-based) ====================

const SESSION_COOKIE = "admin_session";

export async function createSession(userId: number) {
    const token = Buffer.from(`${userId}:${Date.now()}`).toString("base64");
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    });
    return token;
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;

    try {
        const decoded = Buffer.from(token, "base64").toString("utf-8");
        const userId = parseInt(decoded.split(":")[0]);
        if (isNaN(userId)) return null;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, role: true },
        });

        return user;
    } catch {
        return null;
    }
}

export async function destroySession() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
}

// ==================== LOGIN / LOGOUT ====================

export async function loginAdmin(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Email dan password wajib diisi" };
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return { error: "Email atau password salah" };
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
        return { error: "Email atau password salah" };
    }

    await createSession(user.id);
    redirect("/admin");
}

export async function logoutAdmin() {
    await destroySession();
    redirect("/admin/login");
}

// ==================== REQUIRE AUTH HELPER ====================

export async function requireAuth() {
    const user = await getSession();
    if (!user) redirect("/admin/login");
    return user;
}

export async function requireAdmin() {
    const user = await requireAuth();
    if (user.role !== "ADMINISTRATOR") {
        return { error: "Akses ditolak. Hanya Administrator yang bisa melakukan ini." };
    }
    return user;
}
