import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import Link from "next/link";

const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    REFUNDED: "bg-gray-100 text-gray-600",
};

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        include: {
            user: { select: { name: true, email: true } },
            items: true,
        },
        orderBy: { createdAt: "desc" },
        take: 100,
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black">Orders</h1>
                    <p className="text-sm text-gray-500 mt-1">{orders.length} orders total</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Order ID</th>
                            <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Customer</th>
                            <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Items</th>
                            <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Total</th>
                            <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                            <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-mono text-xs font-bold">
                                    #{order.id.slice(-8).toUpperCase()}
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-medium text-gray-900">{order.user?.name ?? "Guest"}</p>
                                    <p className="text-xs text-gray-400">{order.user?.email}</p>
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {order.items.length} item{order.items.length > 1 ? "s" : ""}
                                </td>
                                <td className="px-6 py-4 font-semibold">{formatPrice(order.total)}</td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColors[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-xs">
                                    {new Date(order.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {orders.length === 0 && (
                    <div className="text-center py-16 text-gray-400">
                        <p>No orders yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
