"use client";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/Toaster";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate form submission
        await new Promise((r) => setTimeout(r, 1000));
        setSubmitted(true);
        setLoading(false);
        toast("Message sent successfully!");
    };

    if (submitted) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-black mb-2">Message Sent!</h2>
                    <p className="text-gray-500">We'll get back to you within 24 hours.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-black mb-4">Contact Us</h1>
            <p className="text-gray-500 mb-12 max-w-2xl">Have a question or need help? We'd love to hear from you. Fill out the form below or reach out using our contact details.</p>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Contact info */}
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <Mail className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">Email</p>
                            <p className="text-sm text-gray-500">hello@luxemarket.com</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <Phone className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">Phone</p>
                            <p className="text-sm text-gray-500">+1 (555) 123-4567</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">Address</p>
                            <p className="text-sm text-gray-500">123 Market Street<br />San Francisco, CA 94102</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 mt-8">
                        <h3 className="font-bold mb-2">Business Hours</h3>
                        <p className="text-sm text-gray-500">Mon - Fri: 9:00 AM - 6:00 PM PST</p>
                        <p className="text-sm text-gray-500">Sat - Sun: 10:00 AM - 4:00 PM PST</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-2xl border p-8 space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Input label="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    <Input label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1.5">Message</label>
                        <textarea
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            required
                            rows={6}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-100 outline-none text-sm resize-none"
                            placeholder="How can we help you?"
                        />
                    </div>
                    <Button type="submit" size="lg" loading={loading}>Send Message</Button>
                </form>
            </div>
        </div>
    );
}
