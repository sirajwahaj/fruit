import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const product = await prisma.product.findUnique({
            where: { slug, published: true },
            include: {
                category: true,
                reviews: {
                    include: { user: { select: { name: true, image: true } } },
                    orderBy: { createdAt: "desc" },
                    take: 20,
                },
            },
        });

        if (!product) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json({
            ...product,
            images: JSON.parse(product.images),
            tags: product.tags ? JSON.parse(product.tags) : [],
        });
    } catch {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
