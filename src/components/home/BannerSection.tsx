import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function BannerSection() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid md:grid-cols-2 gap-6">
                {/* Banner 1 */}
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-10 flex items-center justify-between overflow-hidden relative">
                    <div className="relative z-10">
                        <p className="text-orange-100 text-sm font-semibold uppercase tracking-widest mb-2">
                            This Week Only
                        </p>
                        <h3 className="text-3xl font-black text-white mb-2 leading-tight">
                            Bakery<br />Bonanza 🎉
                        </h3>
                        <p className="text-orange-100 text-sm mb-6">
                            Up to 40% off all cakes<br />and pastries
                        </p>
                        <Link
                            href="/shop?category=bakery"
                            className="inline-flex items-center gap-2 bg-white text-orange-600 px-5 py-2.5 rounded-full font-bold text-sm hover:bg-orange-50 transition-colors"
                        >
                            Shop Now <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <span className="text-9xl opacity-30 absolute -right-4 -bottom-4 select-none">🎂</span>
                </div>

                {/* Banner 2 */}
                <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-3xl p-10 flex items-center justify-between overflow-hidden relative">
                    <div className="relative z-10">
                        <p className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-2">
                            New Collection
                        </p>
                        <h3 className="text-3xl font-black text-white mb-2 leading-tight">
                            Summer<br />Fashion Drop 👗
                        </h3>
                        <p className="text-gray-400 text-sm mb-6">
                            Fresh styles just dropped.<br />Limited quantities.
                        </p>
                        <Link
                            href="/shop?category=fashion"
                            className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors"
                        >
                            Explore <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <span className="text-9xl opacity-20 absolute -right-4 -bottom-4 select-none">✨</span>
                </div>
            </div>
        </section>
    );
}
