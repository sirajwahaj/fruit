import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const reviewSchema = z.object({
    rating: z.number().int().min(1).max(5),
    title: z.string().max(200).optional(),
    comment: z.string().max(2000).optional(),
});

export async function POST(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { slug } = await params;
        const product = await prisma.product.findUnique({ where: { slug } });
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const body = await req.json();
        const parsed = reviewSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
        }

        // Check for existing review
        const existing = await prisma.review.findFirst({
            where: { userId: session.user.id, productId: product.id },
        });
        if (existing) {
            return NextResponse.json({ error: "You already reviewed this product" }, { status: 409 });
        }

        const review = await prisma.review.create({
            data: {
                userId: session.user.id,
                productId: product.id,
                ...parsed.data,
            },
            include: { user: { select: { name: true, image: true } } },
        });

        // Update product rating
        const stats = await prisma.review.aggregate({
            where: { productId: product.id },
            _avg: { rating: true },
            _count: true,
        });

        await prisma.product.update({
            where: { id: product.id },
            data: {
                rating: stats._avg.rating ?? 0,
                reviewCount: stats._count,
            },
        });

        return NextResponse.json(review, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
