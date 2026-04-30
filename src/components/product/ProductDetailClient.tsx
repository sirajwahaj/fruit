"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { ProductCard } from "@/components/product/ProductCard";
import { Star, ShoppingCart, Heart, Share2, Truck, RotateCcw, Shield, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/Toaster";

interface Review {
    id: string; rating: number; title?: string | null;
    comment?: string | null; createdAt: Date;
    user: { name?: string | null; image?: string | null };
}

interface Product {
    id: string; name: string; slug: string; price: number;
    comparePrice?: number | null; description: string;
    images: string[]; rating: number; reviewCount: number;
    stock: number; tags: string[]; featured: boolean;
    category: { name: string; slug: string };
    reviews: Review[];
}

export function ProductDetailClient({ product, related }: { product: Product; related: Product[] }) {
    const [selectedImg, setSelectedImg] = useState(0);
    const [qty, setQty] = useState(1);
    const addItem = useCartStore((s) => s.addItem);
    const { toggle, has } = useWishlistStore();
    const discount = product.comparePrice
        ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
        : 0;

    const handleAdd = () => {
        addItem({ id: product.id, name: product.name, price: product.price, image: product.images[0], stock: product.stock }, qty);
        toast(`${product.name} added to cart!`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
                <Link href="/" className="hover:text-black transition-colors">Home</Link>
                <span>/</span>
                <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
                <span>/</span>
                <Link href={`/shop?category=${product.category.slug}`} className="hover:text-black transition-colors">{product.category.name}</Link>
                <span>/</span>
                <span className="text-gray-700 truncate max-w-xs">{product.name}</span>
            </nav>

            <div className="grid lg:grid-cols-2 gap-14 mb-20">
                {/* Images */}
                <div className="space-y-4">
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50">
                        <Image
                            src={product.images[selectedImg] ?? "/placeholder.jpg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority
                        />
                        {discount > 0 && (
                            <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                                -{discount}%
                            </span>
                        )}
                    </div>
                    {product.images.length > 1 && (
                        <div className="flex gap-3">
                            {product.images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImg(i)}
                                    className={cn(
                                        "relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors",
                                        selectedImg === i ? "border-black" : "border-transparent hover:border-gray-300"
                                    )}
                                >
                                    <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div>
                    <Link href={`/shop?category=${product.category.slug}`} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black">
                        {product.category.name}
                    </Link>
                    <h1 className="text-3xl font-black text-gray-900 mt-2 mb-4">{product.name}</h1>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className="w-5 h-5" fill={i < Math.round(product.rating) ? "#f59e0b" : "none"} stroke={i < Math.round(product.rating) ? "#f59e0b" : "#d1d5db"} />
                            ))}
                        </div>
                        <span className="text-sm text-gray-500">({product.reviewCount} reviews)</span>
                    </div>

                    <div className="flex items-baseline gap-3 mb-6">
                        <span className="text-4xl font-black text-gray-900">{formatPrice(product.price)}</span>
                        {product.comparePrice && (
                            <span className="text-xl text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
                        )}
                        {discount > 0 && (
                            <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded-lg">Save {discount}%</span>
                        )}
                    </div>

                    <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

                    {product.stock <= 5 && product.stock > 0 && (
                        <p className="text-amber-600 font-semibold text-sm mb-4">⚠️ Only {product.stock} left in stock!</p>
                    )}
                    {product.stock === 0 && (
                        <p className="text-red-500 font-semibold text-sm mb-4">Out of stock</p>
                    )}

                    {/* Qty + Add to Cart */}
                    <div className="flex gap-4 mb-8">
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                            <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 hover:bg-gray-50 transition-colors text-lg font-medium">−</button>
                            <span className="px-5 py-3 font-bold min-w-[48px] text-center">{qty}</span>
                            <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-4 py-3 hover:bg-gray-50 transition-colors text-lg font-medium" disabled={qty >= product.stock}>+</button>
                        </div>
                        <button
                            onClick={handleAdd}
                            disabled={product.stock === 0}
                            className="flex-1 bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                        </button>
                        <button
                            onClick={() => { toggle(product.id); toast(has(product.id) ? "Removed from wishlist" : "Added to wishlist", "info"); }}
                            className={cn("p-3.5 border rounded-xl transition-colors", has(product.id) ? "bg-red-50 border-red-200 text-red-500" : "border-gray-200 hover:border-gray-300")}
                        >
                            <Heart className="w-5 h-5" fill={has(product.id) ? "currentColor" : "none"} />
                        </button>
                    </div>

                    {/* Trust badges */}
                    <div className="grid grid-cols-3 gap-4 border-t pt-8">
                        {[
                            { icon: Truck, label: "Free Shipping", sub: "Orders over $75" },
                            { icon: RotateCcw, label: "Free Returns", sub: "Within 30 days" },
                            { icon: Shield, label: "Secure Pay", sub: "SSL encrypted" },
                        ].map(({ icon: Icon, label, sub }) => (
                            <div key={label} className="text-center">
                                <Icon className="w-5 h-5 mx-auto mb-1.5 text-gray-500" />
                                <p className="text-xs font-bold text-gray-700">{label}</p>
                                <p className="text-xs text-gray-400">{sub}</p>
                            </div>
                        ))}
                    </div>

                    {product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t">
                            {product.tags.map((tag) => (
                                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Reviews */}
            {product.reviews.length > 0 && (
                <div className="mb-20">
                    <h2 className="text-2xl font-black mb-8">Customer Reviews</h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                        {product.reviews.map((r) => (
                            <div key={r.id} className="bg-gray-50 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} className="w-4 h-4" fill={i < r.rating ? "#f59e0b" : "none"} stroke={i < r.rating ? "#f59e0b" : "#d1d5db"} />
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                                </div>
                                {r.title && <p className="font-bold text-sm mb-1">{r.title}</p>}
                                {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
                                <p className="text-xs text-gray-400 mt-3 font-medium">{r.user.name ?? "Anonymous"}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Related */}
            {related.length > 0 && (
                <div>
                    <h2 className="text-2xl font-black mb-8">You Might Also Like</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        {related.map((p) => <ProductCard key={p.id} {...p} />)}
                    </div>
                </div>
            )}
        </div>
    );
}
