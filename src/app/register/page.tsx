"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const schema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
}).refine((d) => d.password === d.confirm, { message: "Passwords don't match", path: ["confirm"] });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
    const router = useRouter();
    const [serverError, setServerError] = useState("");
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        setServerError("");
        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
        });
        if (!res.ok) {
            const err = await res.json();
            setServerError(err.error ?? "Registration failed");
            return;
        }
        // Auto sign in
        await signIn("credentials", { email: data.email, password: data.password, redirect: false });
        router.push("/");
        router.refresh();
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="text-center mb-8">
                    <span className="text-4xl mb-3 block">🎉</span>
                    <h1 className="text-2xl font-black text-gray-900">Create your account</h1>
                    <p className="text-gray-500 text-sm mt-1">Join Luxe Market and start shopping today</p>
                </div>

                {serverError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm mb-6">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <Input label="Full Name" placeholder="Jane Smith" error={errors.name?.message} {...register("name")} />
                    <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
                    <Input label="Password" type="password" placeholder="Min 8 characters" error={errors.password?.message} hint="Use a strong password with letters and numbers" {...register("password")} />
                    <Input label="Confirm Password" type="password" placeholder="Re-enter password" error={errors.confirm?.message} {...register("confirm")} />
                    <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
                        Create Account
                    </Button>
                </form>

                <p className="text-center text-xs text-gray-400 mt-4">
                    By creating an account you agree to our{" "}
                    <Link href="/terms" className="underline">Terms</Link> and{" "}
                    <Link href="/privacy" className="underline">Privacy Policy</Link>.
                </p>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
                    <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">or</span></div>
                </div>

                <button
                    onClick={() => signIn("google", { callbackUrl: "/" })}
                    className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                </button>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{" "}
                    <Link href="/login" className="font-semibold text-black hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
