"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";

const slides = [
    {
        tag: "New Season",
        title: "Fresh Baked\nEvery Morning",
        subtitle: "Artisan cakes, cookies & pastries made with love. Order by 9am for same-day delivery.",
        cta: "Shop Bakery",
        href: "/shop?category=bakery",
        bg: "from-amber-50 to-orange-100",
        accent: "text-amber-600",
        emoji: "🎂",
    },
    {
        tag: "New Arrivals",
        title: "Summer Fashion\nIs Here",
        subtitle: "Discover our curated collection of dresses, tops, and accessories for every occasion.",
        cta: "Shop Fashion",
        href: "/shop?category=fashion",
        bg: "from-pink-50 to-rose-100",
        accent: "text-rose-500",
        emoji: "👗",
    },
    {
        tag: "Best Sellers",
        title: "Home Décor\nYou'll Love",
        subtitle: "Transform your space with our handpicked selection of furniture, art, and accessories.",
        cta: "Shop Home",
        href: "/shop?category=home-decor",
        bg: "from-teal-50 to-cyan-100",
        accent: "text-teal-600",
        emoji: "🏡",
    },
];

export function HeroSection() {
    return (
        <section className="overflow-hidden">
            {/* Main hero – first slide static for SSR, animated on client */}
            <div className={`bg-gradient-to-br ${slides[0].bg} min-h-[85vh] flex items-center`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            <span className={`inline-block text-sm font-bold uppercase tracking-widest ${slides[0].accent} mb-4 bg-white/60 px-4 py-1.5 rounded-full`}>
                                {slides[0].tag}
                            </span>
                            <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight text-gray-900 whitespace-pre-line mb-6">
                                {slides[0].title}
                            </h1>
                            <p className="text-lg text-gray-600 max-w-md mb-10 leading-relaxed">
                                {slides[0].subtitle}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href={slides[0].href}
                                    className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors text-sm"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    {slides[0].cta}
                                </Link>
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-colors text-sm border border-gray-200"
                                >
                                    View All Products
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                            {/* Trust badges */}
                            <div className="flex flex-wrap gap-6 mt-12 text-sm text-gray-500">
                                {["🚚 Free shipping over $75", "↩️ Free returns", "🔒 Secure checkout", "⭐ 50k+ happy customers"].map((badge) => (
                                    <span key={badge}>{badge}</span>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="hidden lg:flex items-center justify-center"
                        >
                            <div className="relative">
                                <div className="w-80 h-80 rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center text-[180px] shadow-2xl">
                                    {slides[0].emoji}
                                </div>
                                {/* Floating badges */}
                                <motion.div
                                    animate={{ y: [-8, 8, -8] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-4 -right-8 bg-white rounded-2xl shadow-xl px-4 py-3"
                                >
                                    <p className="text-xs text-gray-500">Today's Special</p>
                                    <p className="font-bold text-gray-900 text-sm">20% OFF 🎉</p>
                                </motion.div>
                                <motion.div
                                    animate={{ y: [8, -8, 8] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -bottom-4 -left-8 bg-white rounded-2xl shadow-xl px-4 py-3"
                                >
                                    <p className="text-xs text-gray-500">Fast Delivery</p>
                                    <p className="font-bold text-gray-900 text-sm">Same Day 🚀</p>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Secondary hero cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-8 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {slides.slice(1).map((slide, i) => (
                        <motion.div
                            key={slide.href}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                        >
                            <Link
                                href={slide.href}
                                className={`bg-gradient-to-br ${slide.bg} rounded-2xl p-6 flex items-center justify-between hover:shadow-lg transition-shadow group`}
                            >
                                <div>
                                    <span className={`text-xs font-bold uppercase tracking-widest ${slide.accent}`}>{slide.tag}</span>
                                    <h3 className="text-xl font-bold text-gray-900 mt-1 whitespace-pre-line">{slide.title}</h3>
                                    <span className={`inline-flex items-center gap-1 text-sm font-semibold mt-3 ${slide.accent} group-hover:gap-2 transition-all`}>
                                        {slide.cta} <ArrowRight className="w-4 h-4" />
                                    </span>
                                </div>
                                <span className="text-6xl">{slide.emoji}</span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
