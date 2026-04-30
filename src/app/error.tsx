"use client";

import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
            <p className="text-6xl mb-6">😕</p>
            <h1 className="text-2xl font-black mb-2">Something went wrong</h1>
            <p className="text-gray-500 mb-8 max-w-md">
                We encountered an unexpected error. Please try again or contact support if the issue persists.
            </p>
            <div className="flex gap-4">
                <button
                    onClick={reset}
                    className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                >
                    Try Again
                </button>
                <Link href="/" className="border border-gray-200 px-6 py-3 rounded-xl font-semibold hover:border-black transition-colors">
                    Go Home
                </Link>
            </div>
        </div>
    );
}
