"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Filter, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
    id: string; name: string; slug: string; price: number;
    comparePrice?: number; images: string[]; rating: number;
    reviewCount: number; category: { name: string; slug: string };
    stock: number; featured: boolean;
}

const sortOptions = [
    { label: "Newest", value: "createdAt_desc" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Top Rated", value: "rating_desc" },
    { label: "Most Reviews", value: "reviewCount_desc" },
];

export default function ShopPage() {
    const sp = useSearchParams();
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [filterOpen, setFilterOpen] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    const category = sp.get("category") ?? "";
    const search = sp.get("search") ?? "";
    const sort = sp.get("sort") ?? "createdAt_desc";
    const page = parseInt(sp.get("page") ?? "1");
    const featured = sp.get("featured") === "true";

    const updateParam = (key: string, value: string) => {
        const params = new URLSearchParams(sp.toString());
        if (value) params.set(key, value);
        else params.delete(key);
        params.delete("page");
        router.push(`/shop?${params.toString()}`);
    };

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ sort, page: String(page) });
            if (category) params.set("category", category);
            if (search) params.set("search", search);
            if (featured) params.set("featured", "true");
            const res = await fetch(`/api/products?${params}`);
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setProducts(data.products ?? []);
            setTotal(data.total ?? 0);
            setPages(data.pages ?? 1);
        } catch {
            setProducts([]);
            setTotal(0);
            setPages(1);
        } finally {
            setLoading(false);
        }
    }, [category, search, sort, page, featured]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);
    useEffect(() => {
        fetch("/api/categories").then((r) => r.json()).then(setCategories);
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">
                        {search ? `Search: "${search}"` : category ? categories.find((c: any) => c.slug === category)?.name ?? "Shop" : featured ? "Featured Products" : "All Products"}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">{total} products</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setFilterOpen(!filterOpen)}
                        className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium hover:border-black transition-colors"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                    </button>
                    <select
                        value={sort}
                        onChange={(e) => updateParam("sort", e.target.value)}
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-black bg-white"
                    >
                        {sortOptions.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex gap-8">
                {/* Sidebar filters */}
                <aside className={cn("w-64 flex-shrink-0 space-y-6", !filterOpen && "hidden lg:block")}>
                    {/* Categories */}
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-wider text-gray-700 mb-3">Category</h3>
                        <div className="space-y-1">
                            <button
                                onClick={() => updateParam("category", "")}
                                className={cn("w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                                    !category ? "bg-black text-white font-medium" : "text-gray-600 hover:bg-gray-100")}
                            >
                                All Products
                            </button>
                            {categories.map((cat: any) => (
                                <button
                                    key={cat.slug}
                                    onClick={() => updateParam("category", cat.slug)}
                                    className={cn("w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex justify-between",
                                        category === cat.slug ? "bg-black text-white font-medium" : "text-gray-600 hover:bg-gray-100")}
                                >
                                    <span>{cat.name}</span>
                                    <span className="opacity-60 text-xs">{cat._count?.products}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Active filters */}
                    {(category || search || featured) && (
                        <div>
                            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-700 mb-3">Active Filters</h3>
                            <div className="flex flex-wrap gap-2">
                                {category && <span className="flex items-center gap-1 bg-black text-white text-xs px-3 py-1.5 rounded-full">
                                    {category} <button onClick={() => updateParam("category", "")}><X className="w-3 h-3" /></button>
                                </span>}
                                {search && <span className="flex items-center gap-1 bg-black text-white text-xs px-3 py-1.5 rounded-full">
                                    "{search}" <button onClick={() => updateParam("search", "")}><X className="w-3 h-3" /></button>
                                </span>}
                                {featured && <span className="flex items-center gap-1 bg-black text-white text-xs px-3 py-1.5 rounded-full">
                                    Featured <button onClick={() => updateParam("featured", "")}><X className="w-3 h-3" /></button>
                                </span>}
                            </div>
                        </div>
                    )}
                </aside>

                {/* Product grid */}
                <div className="flex-1">
                    {loading ? (
                        <LoadingSpinner />
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">
                            <p className="text-4xl mb-3">🔍</p>
                            <p className="font-semibold text-lg">No products found</p>
                            <button onClick={() => router.push("/shop")} className="mt-4 text-black underline text-sm">Clear filters</button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map((p) => <ProductCard key={p.id} {...p} />)}
                            </div>
                            {/* Pagination */}
                            {pages > 1 && (
                                <div className="flex justify-center gap-2 mt-12">
                                    {Array.from({ length: pages }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => updateParam("page", String(i + 1))}
                                            className={cn("w-10 h-10 rounded-xl text-sm font-medium transition-colors",
                                                page === i + 1 ? "bg-black text-white" : "border border-gray-200 hover:border-black")}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
