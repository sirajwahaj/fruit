"use client";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function CartDrawer() {
    const [open, setOpen] = useState(false);
    const { items, removeItem, updateQuantity, total, itemCount } = useCartStore();

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="relative p-2 text-gray-700 hover:text-black transition-colors"
                aria-label="Open cart"
            >
                <ShoppingCart className="w-6 h-6" />
                {itemCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {itemCount()}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black z-40"
                            onClick={() => setOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
                        >
                            <div className="flex items-center justify-between p-6 border-b">
                                <h2 className="text-xl font-bold">
                                    Your Cart ({itemCount()})
                                </h2>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {items.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-500">
                                    <ShoppingCart className="w-16 h-16 opacity-30" />
                                    <p className="text-lg">Your cart is empty</p>
                                    <Link
                                        href="/shop"
                                        onClick={() => setOpen(false)}
                                        className="text-black underline font-medium"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                        {items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                                            >
                                                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="80px"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm leading-tight truncate">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {formatPrice(item.price)}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(item.id, item.quantity - 1)
                                                            }
                                                            className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-200 transition-colors"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="w-8 text-center font-medium text-sm">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(item.id, item.quantity + 1)
                                                            }
                                                            className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-200 transition-colors"
                                                            disabled={item.quantity >= item.stock}
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end justify-between">
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                    <p className="font-semibold text-sm">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-6 border-t space-y-4 bg-white">
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Subtotal</span>
                                            <span>{formatPrice(total())}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Shipping</span>
                                            <span>
                                                {total() >= 75 ? (
                                                    <span className="text-green-600">Free</span>
                                                ) : (
                                                    formatPrice(9.99)
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between font-bold text-lg border-t pt-3">
                                            <span>Total</span>
                                            <span>
                                                {formatPrice(total() + (total() >= 75 ? 0 : 9.99))}
                                            </span>
                                        </div>
                                        <Link
                                            href="/checkout"
                                            onClick={() => setOpen(false)}
                                            className="block w-full bg-black text-white text-center py-4 rounded-xl font-semibold hover:bg-gray-900 transition-colors"
                                        >
                                            Checkout
                                        </Link>
                                        <button
                                            onClick={() => setOpen(false)}
                                            className="w-full text-center text-sm text-gray-500 hover:text-black transition-colors"
                                        >
                                            Continue Shopping
                                        </button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
