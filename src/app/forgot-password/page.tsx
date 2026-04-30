"use client";
import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call - in production, send reset email
        await new Promise((r) => setTimeout(r, 1000));
        setSubmitted(true);
        setLoading(false);
    };

    if (submitted) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-black mb-2">Check your email</h1>
                    <p className="text-gray-500 mb-8">
                        We sent a password reset link to <span className="font-semibold text-gray-700">{email}</span>
                    </p>
                    <Link href="/login" className="text-sm text-black underline">Back to Sign In</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <Link href="/login" className="flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-8">
                    <ArrowLeft className="w-4 h-4" /> Back to Sign In
                </Link>

                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                    <Mail className="w-7 h-7 text-gray-600" />
                </div>

                <h1 className="text-3xl font-black mb-2">Forgot password?</h1>
                <p className="text-gray-500 mb-8">No worries, we'll send you reset instructions.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Email address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                    />
                    <Button type="submit" fullWidth size="lg" loading={loading}>
                        Send Reset Link
                    </Button>
                </form>
            </div>
        </div>
    );
}
