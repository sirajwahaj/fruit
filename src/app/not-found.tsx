import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
            <p className="text-8xl font-black text-gray-100 mb-4">404</p>
            <h1 className="text-2xl font-black mb-2">Page Not Found</h1>
            <p className="text-gray-500 mb-8 max-w-md">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <div className="flex gap-4">
                <Link href="/" className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
                    Go Home
                </Link>
                <Link href="/shop" className="border border-gray-200 px-6 py-3 rounded-xl font-semibold hover:border-black transition-colors">
                    Browse Shop
                </Link>
            </div>
        </div>
    );
}
