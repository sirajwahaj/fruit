"use client";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { ShoppingCart, Heart, Star, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ProductCardProps {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number | null;
    images: string[];
    rating: number;
    reviewCount: number;
    category?: { name: string; slug: string };
    stock: number;
    featured?: boolean;
}

export function ProductCard({
    id,
    name,
    slug,
    price,
    comparePrice,
    images,
    rating,
    reviewCount,
    category,
    stock,
}: ProductCardProps) {
    const addItem = useCartStore((s) => s.addItem);
    const { toggle, has } = useWishlistStore();
    const [hovered, setHovered] = useState(false);
    const [added, setAdded] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addItem({ id, name, price, image: images[0], stock });
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    const discount = comparePrice
        ? Math.round(((comparePrice - price) / comparePrice) * 100)
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Link href={`/product/${slug}`} className="block">
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <Image
                        src={images[0] ?? "/placeholder.jpg"}
                        alt={name}
                        fill
                        className={cn(
                            "object-cover transition-transform duration-500",
                            hovered && images[1] ? "opacity-0" : "opacity-100"
                        )}
                        sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    {images[1] && (
                        <Image
                            src={images[1]}
                            alt={name}
                            fill
                            className={cn(
                                "object-cover absolute inset-0 transition-opacity duration-500",
                                hovered ? "opacity-100" : "opacity-0"
                            )}
                            sizes="(max-width: 768px) 50vw, 25vw"
                        />
                    )}
                    {discount > 0 && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            -{discount}%
                        </span>
                    )}
                    {stock === 0 && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                            <span className="font-bold text-gray-500">Out of Stock</span>
                        </div>
                    )}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                        <button
                            onClick={(e) => { e.preventDefault(); toggle(id); }}
                            aria-label={has(id) ? "Remove from wishlist" : "Add to wishlist"}
                            className={cn(
                                "w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center transition-all",
                                has(id) ? "text-red-500" : "text-gray-400 hover:text-red-400"
                            )}
                        >
                            <Heart className="w-4 h-4" fill={has(id) ? "currentColor" : "none"} />
                        </button>
                        <Link
                            href={`/product/${slug}`}
                            className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Eye className="w-4 h-4" />
                        </Link>
                    </div>
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: hovered ? 0 : "100%" }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-0 left-0 right-0 p-3"
                    >
                        <button
                            onClick={handleAddToCart}
                            disabled={stock === 0}
                            className={cn(
                                "w-full py-2.5 rounded-xl font-semibold text-sm transition-colors",
                                added
                                    ? "bg-green-500 text-white"
                                    : "bg-black text-white hover:bg-gray-800 disabled:bg-gray-300"
                            )}
                        >
                            {added ? "Added!" : stock === 0 ? "Out of Stock" : "Add to Cart"}
                        </button>
                    </motion.div>
                </div>
            </Link>

            <div className="p-4">
                {category && (
                    <Link
                        href={`/shop?category=${category.slug}`}
                        className="text-xs text-gray-400 hover:text-black uppercase tracking-wider font-medium"
                    >
                        {category.name}
                    </Link>
                )}
                <Link href={`/product/${slug}`}>
                    <h3 className="font-semibold text-gray-900 mt-1 leading-tight hover:underline line-clamp-2">
                        {name}
                    </h3>
                </Link>
                <div className="flex items-center gap-1 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            className="w-3.5 h-3.5"
                            fill={i < Math.round(rating) ? "#f59e0b" : "none"}
                            stroke={i < Math.round(rating) ? "#f59e0b" : "#d1d5db"}
                        />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">({reviewCount})</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-gray-900">{formatPrice(price)}</span>
                    {comparePrice && (
                        <span className="text-sm text-gray-400 line-through">
                            {formatPrice(comparePrice)}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
