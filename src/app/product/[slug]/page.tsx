import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) return { title: "Product Not Found" };
    const images = JSON.parse(product.images);
    return {
        title: product.name,
        description: product.description.slice(0, 160),
        openGraph: {
            title: product.name,
            description: product.description.slice(0, 160),
            images: images[0] ? [{ url: images[0], width: 800, height: 800 }] : [],
        },
    };
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params;
    const product = await prisma.product.findUnique({
        where: { slug, published: true },
        include: {
            category: true,
            reviews: {
                include: { user: { select: { name: true, image: true } } },
                orderBy: { createdAt: "desc" },
                take: 20,
            },
        },
    });

    if (!product) notFound();

    const related = await prisma.product.findMany({
        where: { categoryId: product.categoryId, published: true, NOT: { id: product.id } },
        include: { category: { select: { name: true, slug: true } } },
        take: 4,
        orderBy: { rating: "desc" },
    });

    return (
        <ProductDetailClient
            product={{ ...product, images: JSON.parse(product.images), tags: product.tags ? JSON.parse(product.tags) : [] }}
            related={related.map((p) => ({ ...p, images: JSON.parse(p.images), tags: p.tags ? JSON.parse(p.tags) : [], reviews: [] }))}
        />
    );
}
