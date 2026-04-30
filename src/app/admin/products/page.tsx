import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import { Plus, Edit, Eye, EyeOff } from "lucide-react";

export default async function AdminProductsPage() {
    const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black">Products</h1>
                    <p className="text-sm text-gray-500 mt-1">{products.length} products total</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add Product
                </Link>
            </div>

            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Product</th>
                            <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Category</th>
                            <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Price</th>
                            <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Stock</th>
                            <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {products.map((p) => {
                            const images = JSON.parse(p.images);
                            return (
                                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {images[0] && (
                                                <Image src={images[0]} alt="" width={48} height={48} className="w-12 h-12 rounded-xl object-cover bg-gray-100" />
                                            )}
                                            <div>
                                                <p className="font-semibold text-gray-900 max-w-xs truncate">{p.name}</p>
                                                {p.featured && (
                                                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Featured</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{p.category.name}</td>
                                    <td className="px-6 py-4 font-semibold">{formatPrice(p.price)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`font-bold ${p.stock <= 5 ? "text-red-500" : p.stock <= 20 ? "text-amber-500" : "text-green-600"}`}>
                                            {p.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${p.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                            {p.published ? <><Eye className="w-3 h-3" />Published</> : <><EyeOff className="w-3 h-3" />Hidden</>}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/admin/products/${p.id}/edit`} className="flex items-center gap-1 text-gray-400 hover:text-black transition-colors">
                                            <Edit className="w-4 h-4" /> Edit
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {products.length === 0 && (
                    <div className="text-center py-16 text-gray-400">
                        <p>No products yet.</p>
                        <Link href="/admin/products/new" className="text-black underline mt-2 inline-block">Add your first product</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
