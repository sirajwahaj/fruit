import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
    { name: "Cakes & Pastries", slug: "bakery", emoji: "🎂", count: "120+ items", color: "bg-amber-50 hover:bg-amber-100 border-amber-200" },
    { name: "Cookies & Sweets", slug: "cookies", emoji: "🍪", count: "85+ items", color: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200" },
    { name: "Women's Fashion", slug: "fashion", emoji: "👗", count: "300+ items", color: "bg-pink-50 hover:bg-pink-100 border-pink-200" },
    { name: "Men's Clothing", slug: "mens", emoji: "👔", count: "200+ items", color: "bg-blue-50 hover:bg-blue-100 border-blue-200" },
    { name: "Home & Décor", slug: "home-decor", emoji: "🏡", count: "150+ items", color: "bg-teal-50 hover:bg-teal-100 border-teal-200" },
    { name: "Accessories", slug: "accessories", emoji: "💍", count: "90+ items", color: "bg-purple-50 hover:bg-purple-100 border-purple-200" },
    { name: "Kids & Toys", slug: "kids", emoji: "🧸", count: "75+ items", color: "bg-green-50 hover:bg-green-100 border-green-200" },
    { name: "Beauty & Care", slug: "beauty", emoji: "💄", count: "60+ items", color: "bg-rose-50 hover:bg-rose-100 border-rose-200" },
];

export function CategoryGrid() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="flex items-end justify-between mb-10">
                <div>
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-2">Browse by</p>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                        Shop Categories
                    </h2>
                </div>
                <Link
                    href="/shop"
                    className="hidden sm:flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black transition-colors"
                >
                    View all <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {categories.map((cat) => (
                    <Link
                        key={cat.slug}
                        href={`/shop?category=${cat.slug}`}
                        className={`group flex flex-col items-center text-center p-6 rounded-2xl border transition-all duration-200 hover:shadow-md ${cat.color}`}
                    >
                        <span className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-200">
                            {cat.emoji}
                        </span>
                        <h3 className="font-bold text-gray-900 text-sm leading-tight">{cat.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{cat.count}</p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
