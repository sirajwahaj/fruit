"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle } from "lucide-react";
import { PageLoader } from "@/components/ui/LoadingSpinner";

const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
    PENDING: { label: "Pending", icon: Clock, color: "text-yellow-600 bg-yellow-50" },
    PROCESSING: { label: "Processing", icon: Clock, color: "text-blue-600 bg-blue-50" },
    SHIPPED: { label: "Shipped", icon: Truck, color: "text-purple-600 bg-purple-50" },
    DELIVERED: { label: "Delivered", icon: CheckCircle, color: "text-green-600 bg-green-50" },
    CANCELLED: { label: "Cancelled", icon: XCircle, color: "text-red-600 bg-red-50" },
    REFUNDED: { label: "Refunded", icon: XCircle, color: "text-gray-600 bg-gray-100" },
};

export default function OrdersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
    }, [status, router]);

    useEffect(() => {
        if (session) {
            fetch("/api/orders")
                .then((r) => {
                    if (!r.ok) throw new Error("Failed");
                    return r.json();
                })
                .then((data) => { setOrders(data); setLoading(false); })
                .catch(() => { setOrders([]); setLoading(false); });
        }
    }, [session]);

    if (loading) return <PageLoader />;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-black mb-8">My Orders</h1>
            {orders.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-semibold">No orders yet</p>
                    <Link href="/shop" className="mt-4 inline-block text-black underline text-sm">Start Shopping</Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order: any) => {
                        const sc = statusConfig[order.status] ?? statusConfig.PENDING;
                        const Icon = sc.icon;
                        return (
                            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="font-bold text-gray-900">Order #{order.id.slice(-8).toUpperCase()}</p>
                                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}</p>
                                    </div>
                                    <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${sc.color}`}>
                                        <Icon className="w-3.5 h-3.5" /> {sc.label}
                                    </span>
                                </div>
                                <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                                    {order.items.slice(0, 4).map((item: any) => (
                                        <div key={item.id} className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                                            {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                                        </div>
                                    ))}
                                    {order.items.length > 4 && (
                                        <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                                            +{order.items.length - 4}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-500">
                                        {order.items.length} item{order.items.length > 1 ? "s" : ""} · {formatPrice(order.total)}
                                    </div>
                                    <Link
                                        href={`/account/orders/${order.id}`}
                                        className="flex items-center gap-1 text-sm font-semibold text-black hover:underline"
                                    >
                                        View Details <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
