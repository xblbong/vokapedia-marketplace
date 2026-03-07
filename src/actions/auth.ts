"use server";

import { prisma } from "@/src/lib/prisma";

export async function registerUser(formData: FormData) {
    const email = formData.get("email") as string;
    const name = formData.get("name") as string | null;

    if (!email) {
        return { error: "Email is required" };
    }

    try {
        const user = await prisma.user.create({
            data: { email, name },
        });

        return { success: true, user };
    } catch (error: unknown) {
        if (
            error instanceof Error &&
            error.message.includes("Unique constraint")
        ) {
            return { error: "Email already exists" };
        }
        return { error: "Failed to register user" };
    }
}
