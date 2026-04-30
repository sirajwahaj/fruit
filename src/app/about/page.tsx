import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-black mb-8">About Luxe Market</h1>

            <div className="prose prose-gray max-w-none space-y-6 text-gray-600 leading-relaxed">
                <p className="text-xl text-gray-700">
                    Welcome to Luxe Market — your one-stop destination for premium cakes, cookies, fashion, home decor, and everything you love.
                </p>

                <h2 className="text-2xl font-black text-gray-900 mt-10">Our Story</h2>
                <p>
                    Founded with a passion for quality and convenience, Luxe Market brings together the finest artisanal products from local craftspeople and independent brands. We believe shopping should be a delightful experience — from browsing to unboxing.
                </p>

                <h2 className="text-2xl font-black text-gray-900 mt-10">What We Offer</h2>
                <div className="grid sm:grid-cols-2 gap-6 not-prose mt-4">
                    {[
                        { emoji: "🎂", title: "Artisan Bakery", desc: "Handcrafted cakes, cookies, and pastries baked fresh for every order." },
                        { emoji: "👗", title: "Fashion & Style", desc: "Curated clothing and accessories for men, women, and kids." },
                        { emoji: "🏠", title: "Home & Living", desc: "Beautiful decor pieces to make your space feel like home." },
                        { emoji: "💄", title: "Beauty & Care", desc: "Premium skincare, cosmetics, and self-care essentials." },
                    ].map(({ emoji, title, desc }) => (
                        <div key={title} className="bg-gray-50 rounded-2xl p-6">
                            <span className="text-3xl">{emoji}</span>
                            <h3 className="font-bold text-gray-900 mt-3">{title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{desc}</p>
                        </div>
                    ))}
                </div>

                <h2 className="text-2xl font-black text-gray-900 mt-10">Our Promise</h2>
                <ul className="space-y-2">
                    <li>✓ Quality guaranteed on every product</li>
                    <li>✓ Free shipping on orders over $75</li>
                    <li>✓ Easy 30-day returns</li>
                    <li>✓ Secure payments with SSL encryption</li>
                    <li>✓ Friendly customer support</li>
                </ul>
            </div>
        </div>
    );
}
