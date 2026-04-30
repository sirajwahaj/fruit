"use client";
import { useState } from "react";
import { Mail } from "lucide-react";

export function NewsletterSection() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubmitted(true);
        }
    };

    return (
        <section className="py-20 bg-white">
            <div className="max-w-2xl mx-auto px-4 text-center">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-12 border border-orange-100">
                    <Mail className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-black text-gray-900 mb-3">
                        Get 10% Off Your First Order
                    </h2>
                    <p className="text-gray-500 mb-8 text-sm">
                        Join over 50,000 subscribers for exclusive deals, new arrivals, and
                        baking inspiration.
                    </p>
                    {submitted ? (
                        <div className="bg-green-100 text-green-700 rounded-xl px-6 py-4 font-semibold">
                            🎉 You're subscribed! Check your inbox for your discount code.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex gap-3 max-w-sm mx-auto">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="your@email.com"
                                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 bg-white"
                            />
                            <button
                                type="submit"
                                className="bg-black text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors whitespace-nowrap"
                            >
                                Subscribe
                            </button>
                        </form>
                    )}
                    <p className="text-xs text-gray-400 mt-4">
                        No spam. Unsubscribe anytime.
                    </p>
                </div>
            </div>
        </section>
    );
}
