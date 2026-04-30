import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: { select: { products: { where: { published: true } } } },
                children: {
                    include: {
                        _count: { select: { products: { where: { published: true } } } },
                    },
                },
            },
            where: { parentId: null },
            orderBy: { name: "asc" },
        });
        return NextResponse.json(categories);
    } catch {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
