import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminCategoriesPage() {
    const categories = await prisma.category.findMany({
        include: {
            _count: { select: { products: true } },
            children: { include: { _count: { select: { products: true } } } },
        },
        where: { parentId: null },
        orderBy: { name: "asc" },
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black">Categories</h1>
                    <p className="text-sm text-gray-500 mt-1">{categories.length} root categories</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Category</th>
                            <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Slug</th>
                            <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Products</th>
                            <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Subcategories</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {categories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-semibold text-gray-900">{cat.name}</p>
                                    {cat.description && <p className="text-xs text-gray-400 mt-0.5">{cat.description}</p>}
                                </td>
                                <td className="px-6 py-4 text-gray-500 font-mono text-xs">{cat.slug}</td>
                                <td className="px-6 py-4 font-semibold">{cat._count.products}</td>
                                <td className="px-6 py-4">
                                    {cat.children.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {cat.children.map((child) => (
                                                <span key={child.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                                    {child.name} ({child._count.products})
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-gray-300 text-xs">None</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
