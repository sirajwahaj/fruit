import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/format";
import { z } from "zod";

const updateSchema = z.object({
    name: z.string().min(2).optional(),
    description: z.string().min(10).optional(),
    price: z.number().positive().optional(),
    comparePrice: z.number().positive().nullable().optional(),
    images: z.array(z.string().url()).optional(),
    categoryId: z.string().optional(),
    stock: z.number().int().min(0).optional(),
    featured: z.boolean().optional(),
    published: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
});

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();
        const parsed = updateSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
        }

        const { images, tags, name, ...rest } = parsed.data;
        const updateData: Record<string, unknown> = { ...rest };

        if (name) {
            updateData.name = name;
            updateData.slug = slugify(name);
        }
        if (images) updateData.images = JSON.stringify(images);
        if (tags) updateData.tags = JSON.stringify(tags);

        const product = await prisma.product.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(product);
    } catch {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;
        await prisma.product.update({
            where: { id },
            data: { published: false },
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
