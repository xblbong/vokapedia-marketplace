import { prisma } from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { page, userAgent } = body;

        if (!page) return NextResponse.json({ error: "Page is required" }, { status: 400 });

        const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";

        await prisma.pageView.create({
            data: { page, ipAddress, userAgent: userAgent || null },
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to track" }, { status: 500 });
    }
}
