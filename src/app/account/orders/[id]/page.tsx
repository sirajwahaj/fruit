"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import { ArrowLeft, Package, Clock, CheckCircle, Truck, XCircle } from "lucide-react";
import { PageLoader } from "@/components/ui/LoadingSpinner";

const statusConfig: Record<string, { label: string; icon: typeof Clock; color: string; step: number }> = {
    PENDING: { label: "Order Placed", icon: Clock, color: "text-yellow-600", step: 1 },
    PROCESSING: { label: "Processing", icon: Package, color: "text-blue-600", step: 2 },
    SHIPPED: { label: "Shipped", icon: Truck, color: "text-purple-600", step: 3 },
    DELIVERED: { label: "Delivered", icon: CheckCircle, color: "text-green-600", step: 4 },
    CANCELLED: { label: "Cancelled", icon: XCircle, color: "text-red-600", step: 0 },
    REFUNDED: { label: "Refunded", icon: XCircle, color: "text-gray-600", step: 0 },
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: session, status: authStatus } = useSession();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authStatus === "unauthenticated") router.push("/login");
    }, [authStatus, router]);

    useEffect(() => {
        if (session) {
            fetch("/api/orders")
                .then((r) => r.json())
                .then((orders) => {
                    const found = orders.find((o: any) => o.id === id);
                    setOrder(found ?? null);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [session, id]);

    if (loading) return <PageLoader />;
    if (!order) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                <p className="text-gray-500">Order not found</p>
                <Link href="/account/orders" className="text-black underline mt-4 inline-block">Back to Orders</Link>
            </div>
        );
    }

    const sc = statusConfig[order.status] ?? statusConfig.PENDING;
    const StatusIcon = sc.icon;
    const steps = ["Order Placed", "Processing", "Shipped", "Delivered"];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link href="/account/orders" className="flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to Orders
            </Link>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black">Order #{order.id.slice(-8).toUpperCase()}</h1>
                    <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { dateStyle: "long" })}</p>
                </div>
                <span className={`flex items-center gap-1.5 text-sm font-bold ${sc.color}`}>
                    <StatusIcon className="w-4 h-4" /> {sc.label}
                </span>
            </div>

            {/* Progress tracker */}
            {sc.step > 0 && (
                <div className="bg-white rounded-2xl border p-6 mb-8">
                    <div className="flex items-center justify-between">
                        {steps.map((step, i) => (
                            <div key={step} className="flex flex-col items-center flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                    i + 1 <= sc.step ? "bg-black text-white" : "bg-gray-100 text-gray-400"
                                }`}>
                                    {i + 1 <= sc.step ? "✓" : i + 1}
                                </div>
                                <p className={`text-xs mt-2 ${i + 1 <= sc.step ? "font-semibold text-black" : "text-gray-400"}`}>{step}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Items */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-bold">Items ({order.items.length})</h2>
                    {order.items.map((item: any) => (
                        <div key={item.id} className="flex gap-4 bg-white rounded-2xl border p-4">
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                                {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                <p className="text-sm font-bold mt-1">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border p-6">
                        <h2 className="text-lg font-bold mb-4">Order Total</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>{formatPrice(order.tax)}</span></div>
                            <div className="flex justify-between font-black text-base pt-2 border-t"><span>Total</span><span>{formatPrice(order.total)}</span></div>
                        </div>
                    </div>

                    {order.address && (
                        <div className="bg-white rounded-2xl border p-6">
                            <h2 className="text-lg font-bold mb-4">Shipping Address</h2>
                            <p className="text-sm text-gray-600">
                                {order.address.name}<br />
                                {order.address.line1}<br />
                                {order.address.line2 && <>{order.address.line2}<br /></>}
                                {order.address.city}, {order.address.state} {order.address.zip}
                            </p>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl border p-6">
                        <h2 className="text-lg font-bold mb-4">Payment</h2>
                        <p className="text-sm text-gray-600">
                            Status: <span className="font-semibold capitalize">{order.paymentStatus ?? "pending"}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
