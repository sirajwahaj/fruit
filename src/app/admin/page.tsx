import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import { Package, Users, ShoppingBag, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";

export default async function AdminDashboard() {
    const [totalOrders, revenueData, totalProducts, totalUsers, recentOrders, lowStock] =
        await Promise.all([
            prisma.order.count(),
            prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "paid" } }),
            prisma.product.count({ where: { published: true } }),
            prisma.user.count(),
            prisma.order.findMany({
                take: 8,
                orderBy: { createdAt: "desc" },
                include: { user: { select: { name: true, email: true } } },
            }),
            prisma.product.findMany({
                where: { stock: { lte: 5 }, published: true },
                select: { id: true, name: true, stock: true, images: true },
                take: 5,
            }),
        ]);

    const stats = [
        { label: "Total Revenue", value: formatPrice(revenueData._sum.total ?? 0), icon: DollarSign, color: "bg-green-50 text-green-600", change: "+12%" },
        { label: "Total Orders", value: totalOrders.toLocaleString(), icon: ShoppingBag, color: "bg-blue-50 text-blue-600", change: "+8%" },
        { label: "Products", value: totalProducts.toLocaleString(), icon: Package, color: "bg-purple-50 text-purple-600", change: "+5%" },
        { label: "Customers", value: totalUsers.toLocaleString(), icon: Users, color: "bg-amber-50 text-amber-600", change: "+15%" },
    ];

    const statusColors: Record<string, string> = {
        PENDING: "bg-yellow-100 text-yellow-700",
        PROCESSING: "bg-blue-100 text-blue-700",
        SHIPPED: "bg-purple-100 text-purple-700",
        DELIVERED: "bg-green-100 text-green-700",
        CANCELLED: "bg-red-100 text-red-700",
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900">Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">Welcome back. Here's what's happening.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map(({ label, value, icon: Icon, color, change }) => (
                    <div key={label} className="bg-white rounded-2xl border p-6 shadow-sm">
                        <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center mb-4`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <p className="text-2xl font-black text-gray-900">{value}</p>
                        <p className="text-sm text-gray-500 mt-1">{label}</p>
                        <p className="text-xs text-green-600 font-semibold mt-2 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> {change} this month
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent orders */}
                <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm">
                    <div className="flex items-center justify-between p-6 border-b">
                        <h2 className="font-bold text-gray-900">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-sm text-gray-500 hover:text-black">View all →</Link>
                    </div>
                    <div className="divide-y">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between px-6 py-4">
                                <div>
                                    <p className="font-medium text-sm text-gray-900">#{order.id.slice(-8).toUpperCase()}</p>
                                    <p className="text-xs text-gray-400">{order.user?.name ?? "Guest"} · {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColors[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                                        {order.status}
                                    </span>
                                    <span className="font-bold text-sm">{formatPrice(order.total)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Low stock */}
                <div className="bg-white rounded-2xl border shadow-sm">
                    <div className="flex items-center gap-2 p-6 border-b">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        <h2 className="font-bold text-gray-900">Low Stock Alert</h2>
                    </div>
                    <div className="divide-y">
                        {lowStock.length === 0 ? (
                            <p className="text-center text-sm text-gray-400 py-8">All products well-stocked ✓</p>
                        ) : (
                            lowStock.map((p) => {
                                const images = JSON.parse(p.images);
                                return (
                                    <div key={p.id} className="flex items-center gap-3 px-6 py-4">
                                        {images[0] && <Image src={images[0]} alt="" width={40} height={40} className="w-10 h-10 rounded-lg object-cover bg-gray-50" />}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{p.name}</p>
                                            <p className={`text-xs font-bold ${p.stock === 0 ? "text-red-500" : "text-amber-500"}`}>
                                                {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                                            </p>
                                        </div>
                                        <Link href={`/admin/products/${p.id}/edit`} className="text-xs text-gray-400 hover:text-black">Edit</Link>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
