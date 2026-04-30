"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toaster";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    if (status === "loading") return <PageLoader />;
    if (!session) { router.push("/login"); return null; }

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.newPassword !== form.confirmPassword) {
            toast("Passwords do not match", "error");
            return;
        }
        if (form.newPassword.length < 8) {
            toast("Password must be at least 8 characters", "error");
            return;
        }
        setLoading(true);
        // In production, call a password change API
        await new Promise((r) => setTimeout(r, 1000));
        toast("Password updated successfully!");
        setForm({ ...form, currentPassword: "", newPassword: "", confirmPassword: "" });
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link href="/account" className="flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to Account
            </Link>

            <h1 className="text-3xl font-black mb-8">Account Settings</h1>

            {/* Profile Section */}
            <div className="bg-white rounded-2xl border p-6 mb-6">
                <h2 className="text-lg font-bold mb-4">Profile Information</h2>
                <div className="space-y-4">
                    <Input label="Name" value={session.user?.name ?? ""} disabled hint="Contact support to change your name" />
                    <Input label="Email" value={session.user?.email ?? ""} disabled hint="Email cannot be changed" />
                </div>
            </div>

            {/* Password Section */}
            <form onSubmit={handlePasswordChange} className="bg-white rounded-2xl border p-6">
                <h2 className="text-lg font-bold mb-4">Change Password</h2>
                <div className="space-y-4">
                    <Input
                        label="Current Password"
                        type="password"
                        value={form.currentPassword}
                        onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                        required
                    />
                    <Input
                        label="New Password"
                        type="password"
                        value={form.newPassword}
                        onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                        required
                        hint="Minimum 8 characters"
                    />
                    <Input
                        label="Confirm New Password"
                        type="password"
                        value={form.confirmPassword}
                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                        required
                    />
                </div>
                <div className="mt-6">
                    <Button type="submit" loading={loading}>Update Password</Button>
                </div>
            </form>
        </div>
    );
}
