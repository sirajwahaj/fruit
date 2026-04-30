"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Plus, X, ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/Toaster";
import { PageLoader } from "@/components/ui/LoadingSpinner";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [form, setForm] = useState({
        name: "", description: "", price: "", comparePrice: "",
        categoryId: "", stock: "0", featured: false, published: true,
    });

    useEffect(() => {
        Promise.all([
            fetch("/api/categories").then((r) => r.json()),
            fetch(`/api/admin/products`).then((r) => r.json()),
        ]).then(([cats, products]) => {
            setCategories(cats);
            const product = products.find((p: any) => p.id === id);
            if (product) {
                setForm({
                    name: product.name,
                    description: product.description,
                    price: String(product.price),
                    comparePrice: product.comparePrice ? String(product.comparePrice) : "",
                    categoryId: product.categoryId,
                    stock: String(product.stock),
                    featured: product.featured,
                    published: product.published,
                });
                setImages(product.images);
                setTags(product.tags ?? []);
            }
            setLoading(false);
        });
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const res = await fetch(`/api/admin/products/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: form.name,
                description: form.description,
                price: parseFloat(form.price),
                comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
                categoryId: form.categoryId,
                stock: parseInt(form.stock),
                featured: form.featured,
                published: form.published,
                images: images.filter(Boolean),
                tags,
            }),
        });
        setSaving(false);
        if (res.ok) {
            toast("Product updated!");
            router.push("/admin/products");
        } else {
            toast("Failed to update product", "error");
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to unpublish this product?")) return;
        const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
        if (res.ok) {
            toast("Product unpublished");
            router.push("/admin/products");
        }
    };

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    if (loading) return <PageLoader />;

    return (
        <div className="max-w-2xl">
            <div className="flex items-center justify-between mb-6">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={handleDelete} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition-colors">
                    <Trash2 className="w-4 h-4" /> Unpublish
                </button>
            </div>
            <h1 className="text-3xl font-black mb-8">Edit Product</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl border p-8 shadow-sm">
                <Input label="Product Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Description *</label>
                    <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        required rows={4}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-100 outline-none text-sm resize-none"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Price ($) *" type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                    <Input label="Compare Price ($)" type="number" step="0.01" min="0" value={form.comparePrice} onChange={(e) => setForm({ ...form, comparePrice: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1.5">Category *</label>
                        <select
                            value={form.categoryId}
                            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                            required
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-black outline-none text-sm bg-white"
                        >
                            <option value="">Select category</option>
                            {categories.map((c: any) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <Input label="Stock *" type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
                </div>

                {/* Images */}
                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Product Images</label>
                    <div className="space-y-2">
                        {images.map((img, i) => (
                            <div key={i} className="flex gap-2">
                                <input
                                    type="url"
                                    placeholder="https://..."
                                    value={img}
                                    onChange={(e) => { const arr = [...images]; arr[i] = e.target.value; setImages(arr); }}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-black outline-none text-sm"
                                />
                                {images.length > 1 && (
                                    <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={() => setImages([...images, ""])} className="flex items-center gap-1 text-sm text-gray-500 hover:text-black mt-2">
                        <Plus className="w-4 h-4" /> Add image URL
                    </button>
                </div>

                {/* Tags */}
                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Tags</label>
                    <div className="flex gap-2 flex-wrap mb-2">
                        {tags.map((t) => (
                            <span key={t} className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full">
                                {t} <button type="button" onClick={() => setTags(tags.filter((x) => x !== t))}><X className="w-3 h-3" /></button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                            placeholder="Add tag" className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-black outline-none text-sm" />
                        <button type="button" onClick={addTag} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium">Add</button>
                    </div>
                </div>

                <div className="flex gap-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-5 h-5 rounded border-gray-300 accent-black" />
                        <span className="text-sm font-medium text-gray-700">Featured</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-5 h-5 rounded border-gray-300 accent-black" />
                        <span className="text-sm font-medium text-gray-700">Published</span>
                    </label>
                </div>

                <Button type="submit" fullWidth size="lg" loading={saving}>
                    Save Changes
                </Button>
            </form>
        </div>
    );
}
