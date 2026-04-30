import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
        redirect("/login");
    }
    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <div className="flex-1 p-8 overflow-auto">{children}</div>
        </div>
    );
}

function AdminSidebar() {
    const links = [
        { href: "/admin", label: "Dashboard", icon: "📊" },
        { href: "/admin/products", label: "Products", icon: "📦" },
        { href: "/admin/orders", label: "Orders", icon: "🛒" },
        { href: "/admin/customers", label: "Customers", icon: "👥" },
        { href: "/admin/categories", label: "Categories", icon: "🗂️" },
    ];
    return (
        <aside className="w-64 bg-white border-r min-h-screen p-6 flex flex-col">
            <div className="flex items-center gap-2 font-black text-xl mb-10">
                <span>🛍️</span>
                <span>Admin</span>
            </div>
            <nav className="space-y-1 flex-1">
                {links.map((l) => (
                    <Link
                        key={l.href}
                        href={l.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
                    >
                        <span>{l.icon}</span>
                        {l.label}
                    </Link>
                ))}
            </nav>
            <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors mt-4">
                ← Back to Store
            </Link>
        </aside>
    );
}
