"use client";
import { useWishlistStore } from "@/lib/store";
import { ProductCard } from "@/components/product/ProductCard";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PageLoader } from "@/components/ui/LoadingSpinner";

interface Product {
    id: string; name: string; slug: string; price: number;
    comparePrice?: number; images: string[]; rating: number;
    reviewCount: number; category: { name: string; slug: string };
    stock: number; featured: boolean;
}

export default function WishlistPage() {
    const { items, toggle } = useWishlistStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (items.length === 0) { setLoading(false); return; }
        fetch(`/api/products?ids=${items.join(",")}`)
            .then((r) => r.json())
            .then((data) => {
                setProducts(data.products ?? []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [items]);

    if (loading) return <PageLoader />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-black mb-8">My Wishlist ({items.length})</h1>
            {items.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <Heart className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-semibold">Your wishlist is empty</p>
                    <Link href="/shop" className="mt-4 inline-block text-black underline text-sm">Browse Products</Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((p) => <ProductCard key={p.id} {...p} />)}
                </div>
            )}
        </div>
    );
}
