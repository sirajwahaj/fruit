import { Star } from "lucide-react";

const testimonials = [
    {
        name: "Sarah M.",
        role: "Regular Customer",
        avatar: "👩‍🦰",
        rating: 5,
        text: "The birthday cake I ordered was absolutely stunning and tasted even better than it looked. My daughter was over the moon! Will definitely order again.",
    },
    {
        name: "James K.",
        role: "Verified Buyer",
        avatar: "👨🏽",
        rating: 5,
        text: "Fast delivery, beautiful packaging, and the dress I ordered fits perfectly. Luxe Market is now my go-to for everything. 10/10 shopping experience.",
    },
    {
        name: "Amelia R.",
        role: "Loyal Customer",
        avatar: "👩🏻",
        rating: 5,
        text: "I've ordered home décor items and cookies multiple times. The quality is consistently amazing and customer support is incredibly responsive.",
    },
    {
        name: "David L.",
        role: "Verified Buyer",
        avatar: "👨🏻‍💼",
        rating: 4,
        text: "Great selection and competitive prices. The cookie hampers make perfect gifts. Packaging is premium and everything arrives in perfect condition.",
    },
];

export function TestimonialsSection() {
    return (
        <section className="bg-gray-950 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-14">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-2">
                        Customer Love
                    </p>
                    <h2 className="text-3xl md:text-4xl font-black text-white">
                        What People Are Saying
                    </h2>
                    <div className="flex items-center justify-center gap-1 mt-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-amber-400" fill="#f59e0b" />
                        ))}
                        <span className="text-gray-400 ml-2 text-sm">4.9/5 from 12,400+ reviews</span>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {testimonials.map((t) => (
                        <div
                            key={t.name}
                            className="bg-gray-900 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors"
                        >
                            <div className="flex items-center gap-1 mb-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-4 h-4"
                                        fill={i < t.rating ? "#f59e0b" : "none"}
                                        stroke={i < t.rating ? "#f59e0b" : "#6b7280"}
                                    />
                                ))}
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{t.avatar}</span>
                                <div>
                                    <p className="font-semibold text-white text-sm">{t.name}</p>
                                    <p className="text-xs text-gray-500">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
