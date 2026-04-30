"use client";
import { useState } from "react";
import { useCartStore } from "@/lib/store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { Lock, CreditCard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toaster";

export default function PaymentPage() {
    const { data: session } = useSession();
    const { items, total, clearCart } = useCartStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const subtotal = total();
    const shipping = subtotal >= 75 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const grandTotal = subtotal + shipping + tax;

    if (items.length === 0) {
        router.push("/checkout");
        return null;
    }

    const handlePayment = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                toast(data.error ?? "Payment failed", "error");
                setLoading(false);
                return;
            }

            const data = await res.json();
            // In production, integrate Stripe Elements here using data.clientSecret
            // For now, simulate success
            clearCart();
            toast("Order placed successfully!", "success");
            router.push(`/account/orders/${data.orderId}`);
        } catch {
            toast("Payment failed. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-black mb-2">Payment</h1>
            <p className="text-gray-500 mb-10">Complete your order securely</p>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                <div className="space-y-2 text-sm">
                    {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-gray-600">
                            <span>{item.name} × {item.quantity}</span>
                            <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                    ))}
                </div>
                <div className="border-t mt-4 pt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                            {shipping === 0 ? "FREE" : formatPrice(shipping)}
                        </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Tax (8%)</span>
                        <span>{formatPrice(tax)}</span>
                    </div>
                    <div className="flex justify-between font-black text-lg pt-2 border-t">
                        <span>Total</span>
                        <span>{formatPrice(grandTotal)}</span>
                    </div>
                </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
                <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="w-5 h-5" />
                    <h2 className="text-lg font-bold">Payment Details</h2>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700 mb-6">
                    <p className="font-semibold">Demo Mode</p>
                    <p>Stripe integration is configured but uses test keys. No real charges will be made.</p>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1.5">Card Number</label>
                        <input
                            type="text"
                            placeholder="4242 4242 4242 4242"
                            disabled
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1.5">Expiry</label>
                            <input type="text" placeholder="12/28" disabled className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1.5">CVC</label>
                            <input type="text" placeholder="123" disabled className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 mb-8 text-gray-400 text-xs">
                <div className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> SSL Encrypted</div>
                <div className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> PCI Compliant</div>
            </div>

            <Button
                onClick={handlePayment}
                loading={loading}
                fullWidth
                size="lg"
                disabled={!session}
            >
                {session ? `Pay ${formatPrice(grandTotal)}` : "Sign in to pay"}
            </Button>
        </div>
    );
}
