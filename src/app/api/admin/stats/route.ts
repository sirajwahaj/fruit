import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const [totalOrders, totalRevenue, totalProducts, totalUsers, recentOrders, lowStock] =
            await Promise.all([
                prisma.order.count(),
                prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "paid" } }),
                prisma.product.count({ where: { published: true } }),
                prisma.user.count(),
                prisma.order.findMany({
                    take: 5,
                    orderBy: { createdAt: "desc" },
                    include: { user: { select: { name: true, email: true } } },
                }),
                prisma.product.findMany({
                    where: { stock: { lte: 5 }, published: true },
                    select: { id: true, name: true, stock: true, images: true },
                    take: 10,
                }),
            ]);

        return NextResponse.json({
            totalOrders,
            totalRevenue: totalRevenue._sum.total ?? 0,
            totalProducts,
            totalUsers,
            recentOrders,
            lowStock: lowStock.map((p) => ({ ...p, images: JSON.parse(p.images) })),
        });
    } catch {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
