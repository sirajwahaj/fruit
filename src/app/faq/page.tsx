import type { Metadata } from "next";

export const metadata: Metadata = { title: "FAQ" };

const faqs = [
    { q: "How long does shipping take?", a: "Standard shipping takes 3-7 business days within the US. Express shipping (1-2 days) is available at checkout." },
    { q: "Is shipping free?", a: "Yes! We offer free standard shipping on all orders over $75. Orders under $75 have a flat $9.99 shipping fee." },
    { q: "What is your return policy?", a: "We accept returns within 30 days of delivery for unused items in original packaging. Perishable items (bakery products) cannot be returned." },
    { q: "How do I track my order?", a: "Once your order ships, you'll receive a tracking number via email. You can also check your order status in your Account > My Orders page." },
    { q: "Do you ship internationally?", a: "Currently, we only ship within the United States. International shipping is coming soon!" },
    { q: "Can I cancel my order?", a: "Orders can be cancelled within 1 hour of placement. After that, the order enters processing and cannot be cancelled." },
    { q: "How do I reset my password?", a: "Click 'Forgot Password' on the login page and we'll send you a reset link via email." },
    { q: "Are your bakery products fresh?", a: "Yes! All bakery items are baked fresh to order and shipped within 24 hours of preparation." },
    { q: "Do you offer gift wrapping?", a: "Yes, gift wrapping is available at checkout for a small additional fee. You can also include a custom gift message." },
    { q: "How can I contact customer support?", a: "You can reach us via email at hello@luxemarket.com, by phone at +1 (555) 123-4567, or through our Contact page." },
];

export default function FAQPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-black mb-4">Frequently Asked Questions</h1>
            <p className="text-gray-500 mb-12">Find answers to common questions below. Can't find what you're looking for? Contact us!</p>

            <div className="space-y-6">
                {faqs.map(({ q, a }, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h2 className="font-bold text-gray-900 mb-2">{q}</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
