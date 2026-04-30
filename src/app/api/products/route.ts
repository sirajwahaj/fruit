import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_SORT_FIELDS = ["createdAt", "price", "rating", "reviewCount", "name"];
const VALID_SORT_ORDERS = ["asc", "desc"];

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const page = Math.max(1, parseInt(searchParams.get("page") ?? "1") || 1);
        const limit = Math.min(48, Math.max(1, parseInt(searchParams.get("limit") ?? "12") || 12));
        const category = searchParams.get("category");
        const search = searchParams.get("search");
        const sort = searchParams.get("sort") ?? "createdAt_desc";
        const minPrice = Math.max(0, parseFloat(searchParams.get("minPrice") ?? "0") || 0);
        const maxPrice = Math.min(999999, parseFloat(searchParams.get("maxPrice") ?? "999999") || 999999);
        const featured = searchParams.get("featured") === "true";
        const ids = searchParams.get("ids");

        const [sortField, sortOrder] = sort.split("_");
        const safeSortField = VALID_SORT_FIELDS.includes(sortField) ? sortField : "createdAt";
        const safeSortOrder = VALID_SORT_ORDERS.includes(sortOrder) ? sortOrder : "desc";

        const where: Record<string, unknown> = {
            published: true,
            price: { gte: minPrice, lte: maxPrice },
        };

        if (category) where.category = { slug: category };
        if (search) where.name = { contains: search };
        if (featured) where.featured = true;
        if (ids) where.id = { in: ids.split(",") };

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: { category: { select: { name: true, slug: true } } },
                orderBy: { [safeSortField]: safeSortOrder as "asc" | "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.product.count({ where }),
        ]);

        return NextResponse.json({
            products: products.map((p) => ({
                ...p,
                images: JSON.parse(p.images),
                tags: p.tags ? JSON.parse(p.tags) : [],
            })),
            total,
            pages: Math.ceil(total / limit),
            page,
        });
    } catch {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
