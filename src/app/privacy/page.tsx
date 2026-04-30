import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-black mb-8">Privacy Policy</h1>
            <p className="text-sm text-gray-400 mb-8">Last updated: May 1, 2026</p>

            <div className="prose prose-gray max-w-none space-y-6 text-gray-600 leading-relaxed">
                <h2 className="text-xl font-bold text-gray-900">1. Information We Collect</h2>
                <p>We collect information you provide directly, including your name, email address, shipping address, and payment information when you create an account or place an order.</p>

                <h2 className="text-xl font-bold text-gray-900">2. How We Use Your Information</h2>
                <p>We use your information to:</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Process and fulfill your orders</li>
                    <li>Send order confirmations and shipping updates</li>
                    <li>Respond to your inquiries and provide customer support</li>
                    <li>Improve our products and services</li>
                    <li>Send promotional emails (with your consent)</li>
                </ul>

                <h2 className="text-xl font-bold text-gray-900">3. Information Sharing</h2>
                <p>We do not sell your personal information. We share data only with:</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Payment processors (Stripe) to complete transactions</li>
                    <li>Shipping carriers to deliver your orders</li>
                    <li>Service providers who help us operate our business</li>
                </ul>

                <h2 className="text-xl font-bold text-gray-900">4. Data Security</h2>
                <p>We implement industry-standard security measures including SSL encryption, secure password hashing, and regular security audits to protect your data.</p>

                <h2 className="text-xl font-bold text-gray-900">5. Cookies</h2>
                <p>We use essential cookies for authentication and cart functionality. We do not use third-party tracking cookies without your consent.</p>

                <h2 className="text-xl font-bold text-gray-900">6. Your Rights</h2>
                <p>You have the right to access, update, or delete your personal information at any time through your account settings or by contacting us.</p>

                <h2 className="text-xl font-bold text-gray-900">7. Contact Us</h2>
                <p>If you have questions about this privacy policy, contact us at privacy@luxemarket.com.</p>
            </div>
        </div>
    );
}
