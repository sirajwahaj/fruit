export function PromoBar() {
    const messages = [
        "🚚 Free shipping on orders over $75",
        "🎉 Use code WELCOME10 for 10% off your first order",
        "⭐ Over 50,000 happy customers worldwide",
        "🔒 Secure payment with Stripe",
    ];

    return (
        <div className="bg-black text-white text-xs font-medium py-2.5 overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap gap-16 px-4">
                {[...messages, ...messages].map((msg, i) => (
                    <span key={i} className="flex-shrink-0">{msg}</span>
                ))}
            </div>
        </div>
    );
}
