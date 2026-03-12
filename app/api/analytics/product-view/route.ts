import { prisma } from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { productId } = body;
        if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

        await prisma.productView.create({ data: { productId: parseInt(productId) } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
