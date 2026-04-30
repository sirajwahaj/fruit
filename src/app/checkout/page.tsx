"use client";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

export default function CheckoutPage() {
    const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
    const subtotal = total();
    const shipping = subtotal >= 75 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const grandTotal = subtotal + shipping + tax;

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
                <ShoppingBag className="w-20 h-20 text-gray-200 mb-6" />
                <h1 className="text-2xl font-black mb-2">Your cart is empty</h1>
                <p className="text-gray-500 mb-8">Add some products before checking out.</p>
                <Link href="/shop" className="bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-black mb-10">Checkout</h1>
            <div className="grid lg:grid-cols-3 gap-10">
                {/* Cart items */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-bold mb-4">Your Items ({items.length})</h2>
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <Link href={`/product/${item.id}`} className="font-semibold text-gray-900 hover:underline line-clamp-2">{item.name}</Link>
                                <p className="text-gray-500 text-sm mt-1">{formatPrice(item.price)} each</p>
                                <div className="flex items-center gap-3 mt-3">
                                    <div className="flex items-center border rounded-lg overflow-hidden">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1.5 hover:bg-gray-50 text-sm">−</button>
                                        <span className="px-4 py-1.5 text-sm font-medium border-x">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock} className="px-3 py-1.5 hover:bg-gray-50 text-sm disabled:opacity-40">+</button>
                                    </div>
                                    <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="font-bold text-gray-900 self-center">{formatPrice(item.price * item.quantity)}</div>
                        </div>
                    ))}
                </div>

                {/* Order summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
                        <h2 className="text-lg font-bold mb-6">Order Summary</h2>
                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className={shipping === 0 ? "text-green-600 font-medium" : "font-medium text-gray-900"}>
                                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax (8%)</span>
                                <span className="font-medium text-gray-900">{formatPrice(tax)}</span>
                            </div>
                            {shipping > 0 && (
                                <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2">
                                    Add {formatPrice(75 - subtotal)} more for free shipping!
                                </p>
                            )}
                        </div>
                        <div className="border-t mt-5 pt-5 flex justify-between font-black text-lg">
                            <span>Total</span>
                            <span>{formatPrice(grandTotal)}</span>
                        </div>
                        <Link
                            href="/checkout/payment"
                            className="mt-6 w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                        >
                            Proceed to Payment <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="/shop" className="block text-center text-sm text-gray-400 hover:text-black mt-4 transition-colors">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
