import { prisma } from "@/lib/prisma";

export default async function AdminCustomersPage() {
    const users = await prisma.user.findMany({
        include: {
            _count: { select: { orders: true, reviews: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 100,
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black">Customers</h1>
                    <p className="text-sm text-gray-500 mt-1">{users.length} customers total</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Customer</th>
                            <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Role</th>
                            <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Orders</th>
                            <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Reviews</th>
                            <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-medium text-gray-900">{user.name ?? "No name"}</p>
                                    <p className="text-xs text-gray-400">{user.email}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${user.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-semibold">{user._count.orders}</td>
                                <td className="px-6 py-4 font-semibold">{user._count.reviews}</td>
                                <td className="px-6 py-4 text-gray-500 text-xs">
                                    {new Date(user.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
