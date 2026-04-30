"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Plus, X, ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/Toaster";

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [images, setImages] = useState<string[]>([""]);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [form, setForm] = useState({
        name: "", description: "", price: "", comparePrice: "",
        categoryId: "", stock: "0", featured: false,
    });

    useEffect(() => {
        fetch("/api/categories").then((r) => r.json()).then(setCategories);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: form.name,
                description: form.description,
                price: parseFloat(form.price),
                comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : undefined,
                categoryId: form.categoryId,
                stock: parseInt(form.stock),
                featured: form.featured,
                images: images.filter(Boolean),
                tags,
            }),
        });
        setLoading(false);
        if (res.ok) {
            toast("Product created successfully!");
            router.push("/admin/products");
        } else {
            toast("Failed to create product", "error");
        }
    };

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    return (
        <div className="max-w-2xl">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="text-3xl font-black mb-8">Add New Product</h1>

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
                    <Input label="Compare Price ($)" type="number" step="0.01" min="0" value={form.comparePrice} onChange={(e) => setForm({ ...form, comparePrice: e.target.value })} hint="Original price for discount display" />
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
                    <button type="button" onClick={() => setImages([...images, ""])} className="flex items-center gap-1 text-sm text-gray-500 hover:text-black mt-2 transition-colors">
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
                            placeholder="Add tag and press Enter" className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-black outline-none text-sm" />
                        <button type="button" onClick={addTag} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition-colors">Add</button>
                    </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-5 h-5 rounded border-gray-300 accent-black" />
                    <span className="text-sm font-medium text-gray-700">Featured product (shown on homepage)</span>
                </label>

                <Button type="submit" fullWidth size="lg" loading={loading}>
                    Create Product
                </Button>
            </form>
        </div>
    );
}
