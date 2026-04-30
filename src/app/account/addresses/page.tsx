"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MapPin, Plus, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toaster";
import { PageLoader } from "@/components/ui/LoadingSpinner";

interface Address {
    id: string;
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    isDefault: boolean;
}

export default function AddressesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: "", line1: "", line2: "", city: "", state: "", zip: "", country: "US", isDefault: false,
    });

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
    }, [status, router]);

    useEffect(() => {
        if (session) fetchAddresses();
    }, [session]);

    const fetchAddresses = async () => {
        const res = await fetch("/api/addresses");
        if (res.ok) setAddresses(await res.json());
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const res = await fetch("/api/addresses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        setSaving(false);
        if (res.ok) {
            toast("Address added!");
            setShowForm(false);
            setForm({ name: "", line1: "", line2: "", city: "", state: "", zip: "", country: "US", isDefault: false });
            fetchAddresses();
        } else {
            toast("Failed to add address", "error");
        }
    };

    const handleDelete = async (id: string) => {
        const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
        if (res.ok) {
            toast("Address removed");
            setAddresses(addresses.filter((a) => a.id !== id));
        }
    };

    if (loading) return <PageLoader />;

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-black">My Addresses</h1>
                <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "secondary" : "primary"}>
                    {showForm ? "Cancel" : <><Plus className="w-4 h-4" /> Add Address</>}
                </Button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-6 mb-8 space-y-4">
                    <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    <Input label="Address Line 1" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} required />
                    <Input label="Address Line 2" value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} />
                    <div className="grid grid-cols-3 gap-4">
                        <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                        <Input label="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required />
                        <Input label="ZIP Code" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} required />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="accent-black" />
                        <span className="text-sm">Set as default address</span>
                    </label>
                    <Button type="submit" loading={saving}>Save Address</Button>
                </form>
            )}

            {addresses.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <MapPin className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-semibold">No addresses saved</p>
                    <p className="text-sm mt-1">Add an address for faster checkout</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {addresses.map((addr) => (
                        <div key={addr.id} className="bg-white rounded-2xl border p-6 flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="font-semibold text-gray-900">{addr.name}</p>
                                    {addr.isDefault && (
                                        <span className="flex items-center gap-0.5 text-xs bg-black text-white px-2 py-0.5 rounded-full">
                                            <Star className="w-3 h-3" /> Default
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600">
                                    {addr.line1}{addr.line2 && `, ${addr.line2}`}<br />
                                    {addr.city}, {addr.state} {addr.zip}
                                </p>
                            </div>
                            <button onClick={() => handleDelete(addr.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
