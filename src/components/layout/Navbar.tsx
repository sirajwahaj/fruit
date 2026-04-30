"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Search, Menu, X, User, LogOut, Package, LayoutDashboard, Heart } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navLinks = [
    { href: "/shop", label: "Shop All" },
    { href: "/shop?category=bakery", label: "Bakery" },
    { href: "/shop?category=fashion", label: "Fashion" },
    { href: "/shop?category=home-decor", label: "Home" },
    { href: "/shop?featured=true", label: "Featured" },
];

export function Navbar() {
    const { data: session } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [scrolled, setScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handler);
        return () => window.removeEventListener("scroll", handler);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
        setUserMenuOpen(false);
    }, [pathname]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
            setSearchOpen(false);
            setQuery("");
        }
    };

    return (
        <header
            className={cn(
                "sticky top-0 z-30 w-full transition-all duration-300",
                scrolled
                    ? "bg-white/95 backdrop-blur-md shadow-sm"
                    : "bg-white border-b border-gray-100"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <span className="text-2xl">🛍️</span>
                        <span>Luxe Market</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-black",
                                    pathname === link.href ? "text-black" : "text-gray-500"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <AnimatePresence>
                            {searchOpen ? (
                                <motion.form
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 220, opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    onSubmit={handleSearch}
                                    className="flex items-center overflow-hidden"
                                >
                                    <input
                                        autoFocus
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Search products…"
                                        className="w-full border-b border-gray-300 focus:border-black outline-none text-sm py-1 px-2 bg-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setSearchOpen(false)}
                                        className="p-1 text-gray-400 hover:text-black ml-1"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </motion.form>
                            ) : (
                                <button
                                    onClick={() => setSearchOpen(true)}
                                    className="p-2 text-gray-700 hover:text-black transition-colors"
                                    aria-label="Search"
                                >
                                    <Search className="w-5 h-5" />
                                </button>
                            )}
                        </AnimatePresence>

                        {/* Wishlist */}
                        <Link href="/wishlist" className="hidden sm:flex p-2 text-gray-700 hover:text-black transition-colors" aria-label="Wishlist">
                            <Heart className="w-5 h-5" />
                        </Link>

                        {/* Cart */}
                        <CartDrawer />

                        {/* User menu */}
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="p-2 text-gray-700 hover:text-black transition-colors flex items-center gap-1"
                                aria-label="Account"
                            >
                                {session?.user?.image ? (
                                    <Image
                                        src={session.user.image}
                                        alt="avatar"
                                        width={28}
                                        height={28}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <User className="w-5 h-5" />
                                )}
                            </button>

                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                                    >
                                        {session ? (
                                            <>
                                                <div className="px-4 py-3 border-b">
                                                    <p className="font-semibold text-sm truncate">{session.user?.name}</p>
                                                    <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
                                                </div>
                                                <Link href="/account" className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50 transition-colors">
                                                    <User className="w-4 h-4" /> My Account
                                                </Link>
                                                <Link href="/account/orders" className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50 transition-colors">
                                                    <Package className="w-4 h-4" /> My Orders
                                                </Link>
                                                {session.user?.role === "ADMIN" && (
                                                    <Link href="/admin" className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50 transition-colors text-purple-600">
                                                        <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={() => signOut({ callbackUrl: "/" })}
                                                    className="flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors w-full border-t"
                                                >
                                                    <LogOut className="w-4 h-4" /> Sign Out
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <Link href="/login" className="block px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors">
                                                    Sign In
                                                </Link>
                                                <Link href="/register" className="block px-4 py-3 text-sm bg-black text-white text-center font-medium hover:bg-gray-900 transition-colors">
                                                    Create Account
                                                </Link>
                                            </>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden p-2 text-gray-700 hover:text-black"
                            aria-label="Menu"
                        >
                            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.nav
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden overflow-hidden border-t pb-4"
                        >
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block py-3 px-2 text-sm font-medium text-gray-700 hover:text-black border-b border-gray-50 last:border-0"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </motion.nav>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}
