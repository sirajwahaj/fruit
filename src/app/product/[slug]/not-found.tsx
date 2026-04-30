import Link from "next/link";

export default function ProductNotFound() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
            <p className="text-6xl mb-6">🔍</p>
            <h1 className="text-2xl font-black mb-2">Product Not Found</h1>
            <p className="text-gray-500 mb-8">This product doesn't exist or is no longer available.</p>
            <Link href="/shop" className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
                Browse Shop
            </Link>
        </div>
    );
}
