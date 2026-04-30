import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export async function FeaturedProducts() {
    const products = await prisma.product.findMany({
        where: { featured: true, published: true },
        include: { category: { select: { name: true, slug: true } } },
        take: 8,
        orderBy: { createdAt: "desc" },
    });

    if (products.length === 0) return null;

    return (
        <section className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-2">
                            Hand-picked
                        </p>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                            Featured Products
                        </h2>
                    </div>
                    <Link
                        href="/shop?featured=true"
                        className="hidden sm:flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black transition-colors"
                    >
                        See all <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            {...product}
                            images={JSON.parse(product.images)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
