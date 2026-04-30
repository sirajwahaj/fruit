import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-black mb-8">Terms of Service</h1>
            <p className="text-sm text-gray-400 mb-8">Last updated: May 1, 2026</p>

            <div className="prose prose-gray max-w-none space-y-6 text-gray-600 leading-relaxed">
                <h2 className="text-xl font-bold text-gray-900">1. Acceptance of Terms</h2>
                <p>By accessing and using Luxe Market, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>

                <h2 className="text-xl font-bold text-gray-900">2. Account Registration</h2>
                <p>You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your credentials and all activities under your account.</p>

                <h2 className="text-xl font-bold text-gray-900">3. Orders and Payment</h2>
                <ul className="list-disc pl-6 space-y-1">
                    <li>All prices are in USD and include applicable taxes at checkout</li>
                    <li>We reserve the right to cancel orders due to pricing errors or stock issues</li>
                    <li>Payment is processed securely through Stripe</li>
                    <li>Orders are confirmed only when payment is successfully processed</li>
                </ul>

                <h2 className="text-xl font-bold text-gray-900">4. Shipping and Delivery</h2>
                <p>Free shipping on orders over $75. Standard delivery takes 3-7 business days. We are not responsible for delays caused by carriers or customs.</p>

                <h2 className="text-xl font-bold text-gray-900">5. Returns and Refunds</h2>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Items may be returned within 30 days of delivery</li>
                    <li>Products must be unused and in original packaging</li>
                    <li>Perishable items (cakes, cookies) cannot be returned</li>
                    <li>Refunds are processed within 5-10 business days</li>
                </ul>

                <h2 className="text-xl font-bold text-gray-900">6. Intellectual Property</h2>
                <p>All content on this website is the property of Luxe Market. You may not reproduce, distribute, or modify any content without prior written consent.</p>

                <h2 className="text-xl font-bold text-gray-900">7. Limitation of Liability</h2>
                <p>Luxe Market shall not be liable for indirect, incidental, or consequential damages arising from the use of our services.</p>

                <h2 className="text-xl font-bold text-gray-900">8. Changes to Terms</h2>
                <p>We reserve the right to update these terms. Continued use of our services constitutes acceptance of updated terms.</p>

                <h2 className="text-xl font-bold text-gray-900">9. Contact</h2>
                <p>Questions about these terms? Contact us at legal@luxemarket.com.</p>
            </div>
        </div>
    );
}
