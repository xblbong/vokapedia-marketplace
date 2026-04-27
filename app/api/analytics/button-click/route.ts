import { prisma } from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { type, productId, startupId } = body;
        if (!type || !["WHATSAPP", "ECOMMERCE"].includes(type)) {
            return NextResponse.json({ error: "Valid type required" }, { status: 400 });
        }

        await prisma.buttonClick.create({
            data: {
                type: type as string,
                productId: productId ? parseInt(productId) : null,
                startupId: startupId ? parseInt(startupId) : null,
            },
        });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
