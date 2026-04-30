import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { slugify } from "@/lib/format";

const schema = z.object({
    name: z.string().min(2).max(200),
    description: z.string().min(10).max(5000),
    price: z.number().positive().max(99999),
    comparePrice: z.number().positive().optional(),
    images: z.array(z.string().url()).min(1).max(10),
    categoryId: z.string().min(1),
    stock: z.number().int().min(0).max(99999),
    featured: z.boolean().optional(),
    tags: z.array(z.string().max(50)).max(20).optional(),
});

export async function GET() {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const products = await prisma.product.findMany({
            include: { category: true },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(
            products.map((p) => ({ ...p, images: JSON.parse(p.images), tags: p.tags ? JSON.parse(p.tags) : [] }))
        );
    } catch {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        const parsed = schema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
        }

        const { name, images, tags, ...rest } = parsed.data;
        let slug = slugify(name);
        const existing = await prisma.product.findUnique({ where: { slug } });
        if (existing) slug = `${slug}-${Date.now()}`;

        const product = await prisma.product.create({
            data: {
                name,
                slug,
                images: JSON.stringify(images),
                tags: tags ? JSON.stringify(tags) : null,
                ...rest,
            },
        });

        return NextResponse.json({ ...product, images, tags: tags ?? [] }, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
