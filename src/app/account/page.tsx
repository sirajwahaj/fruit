"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Package, Heart, MapPin, Settings, LogOut, ChevronRight } from "lucide-react";
import { getInitials } from "@/lib/format";
import { PageLoader } from "@/components/ui/LoadingSpinner";

const menuItems = [
    { icon: Package, label: "My Orders", href: "/account/orders", desc: "Track and manage your orders" },
    { icon: Heart, label: "Wishlist", href: "/wishlist", desc: "Your saved items" },
    { icon: MapPin, label: "Addresses", href: "/account/addresses", desc: "Manage delivery addresses" },
    { icon: Settings, label: "Settings", href: "/account/settings", desc: "Update your profile & password" },
];

export default function AccountPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
    }, [status, router]);

    if (status === "loading") return <PageLoader />;
    if (!session) return null;

    const user = session.user!;

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Profile header */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 text-white mb-8 flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-2xl font-black">
                    {user.image ? (
                        <Image src={user.image} alt="avatar" width={80} height={80} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        getInitials(user.name ?? "U")
                    )}
                </div>
                <div>
                    <h1 className="text-2xl font-black">{user.name}</h1>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                    {user.role === "ADMIN" && (
                        <span className="inline-block mt-2 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            Admin
                        </span>
                    )}
                </div>
            </div>

            {/* Menu */}
            <div className="space-y-3">
                {menuItems.map(({ icon: Icon, label, href, desc }) => (
                    <Link
                        key={href}
                        href={href}
                        className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow group"
                    >
                        <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                            <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-900">{label}</p>
                            <p className="text-sm text-gray-400">{desc}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors" />
                    </Link>
                ))}

                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-5 hover:border-red-200 hover:bg-red-50 transition-all w-full group"
                >
                    <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors text-red-500">
                        <LogOut className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                        <p className="font-semibold text-red-500">Sign Out</p>
                        <p className="text-sm text-gray-400">Sign out of your account</p>
                    </div>
                </button>
            </div>
        </div>
    );
}
