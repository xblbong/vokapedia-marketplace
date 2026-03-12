import { prisma } from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { startupId } = body;
        if (!startupId) return NextResponse.json({ error: "startupId required" }, { status: 400 });

        await prisma.startupView.create({ data: { startupId: parseInt(startupId) } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
