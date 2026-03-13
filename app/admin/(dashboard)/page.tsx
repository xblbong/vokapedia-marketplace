import { prisma } from "@/src/lib/prisma";
import { requireAuth } from "@/src/lib/auth";
import {
    Eye,
    Package,
    Building2,
    Users,
    MessageCircle,
    ShoppingCart,
    TrendingUp,
    Store,
    Clock,
} from "lucide-react";

async function getAnalytics() {
    const [
        totalPageViews,
        totalProducts,
        totalStartups,
        totalUsers,
        totalWhatsappClicks,
        totalEcommerceClicks,
        topProducts,
        topStartups,
        recentPageViews,
    ] = await Promise.all([
        prisma.pageView.count(),
        prisma.product.count(),
        prisma.startup.count(),
        prisma.user.count(),
        prisma.buttonClick.count({ where: { type: "WHATSAPP" } }),
        prisma.buttonClick.count({ where: { type: "ECOMMERCE" } }),
        prisma.productView.groupBy({
            by: ["productId"],
            _count: { productId: true },
            orderBy: { _count: { productId: "desc" } },
            take: 5,
        }),
        prisma.startupView.groupBy({
            by: ["startupId"],
            _count: { startupId: true },
            orderBy: { _count: { startupId: "desc" } },
            take: 5,
        }),
        prisma.pageView.findMany({
            orderBy: { createdAt: "desc" },
            take: 10,
            select: { id: true, page: true, createdAt: true },
        }),
    ]);

    const topProductsWithNames = await Promise.all(
        topProducts.map(async (p) => {
            const product = await prisma.product.findUnique({ where: { id: p.productId }, select: { title: true } });
            return { name: product?.title || "Unknown", views: p._count.productId };
        })
    );

    const topStartupsWithNames = await Promise.all(
        topStartups.map(async (s) => {
            const startup = await prisma.startup.findUnique({ where: { id: s.startupId }, select: { name: true } });
            return { name: startup?.name || "Unknown", views: s._count.startupId };
        })
    );

    return {
        totalPageViews,
        totalProducts,
        totalStartups,
        totalUsers,
        totalWhatsappClicks,
        totalEcommerceClicks,
        topProducts: topProductsWithNames,
        topStartups: topStartupsWithNames,
        recentPageViews,
    };
}

const iconMap: Record<string, React.FC<{ size?: number; strokeWidth?: number; color?: string }>> = {
    "Total Pengunjung": Eye,
    "Total Produk": Package,
    "Total Startup": Building2,
    "Total Admin": Users,
    "Klik WhatsApp": MessageCircle,
    "Klik E-commerce": ShoppingCart,
};

export default async function AdminDashboard() {
    await requireAuth();
    const data = await getAnalytics();

    const statCards = [
        { label: "Total Pengunjung", value: data.totalPageViews, color: "#0062FF" },
        { label: "Total Produk", value: data.totalProducts, color: "#10B981" },
        { label: "Total Startup", value: data.totalStartups, color: "#F59E0B" },
        { label: "Total Admin", value: data.totalUsers, color: "#8B5CF6" },
        { label: "Klik WhatsApp", value: data.totalWhatsappClicks, color: "#25D366" },
        { label: "Klik E-commerce", value: data.totalEcommerceClicks, color: "#EF4444" },
    ];

    return (
        <div>
            <h1 className="text-[28px] font-bold mb-2 text-[var(--color-main-text)]">Dashboard</h1>
            <p className="text-[var(--color-inactive-text)] text-sm mb-8">Selamat datang di Vokapedia Admin Panel</p>

            {/* Stat Cards */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mb-8">
                {statCards.map((card) => {
                    const Icon = iconMap[card.label];
                    return (
                        <div key={card.label} className="p-6 rounded-2xl bg-white border border-gray-200 transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md">
                            <div className="flex justify-between items-start mb-3">
                                <div
                                    className="w-10 h-10 rounded-[10px] flex items-center justify-center"
                                    style={{ background: `${card.color}12` }}
                                >
                                    {Icon && <Icon size={20} color={card.color} strokeWidth={2} />}
                                </div>
                                <div className="w-2 h-2 rounded-full" style={{ background: card.color }} />
                            </div>
                            <p className="text-[32px] font-bold mb-1 text-[var(--color-main-text)]">{card.value}</p>
                            <p className="text-[13px] text-[var(--color-inactive-text)]">{card.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Top Products & Startups */}
            <div className="grid grid-cols-2 gap-5 mb-8">
                {/* Top Products */}
                <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp size={18} color="#0062FF" strokeWidth={2} />
                        <h3 className="text-base font-semibold text-[var(--color-main-text)]">Produk Terpopuler</h3>
                    </div>
                    {data.topProducts.length === 0 ? (
                        <p className="text-[var(--color-inactive-text)] text-[13px]">Belum ada data</p>
                    ) : (
                        <div className="flex flex-col gap-2.5">
                            {data.topProducts.map((p, i) => (
                                <div key={i} className="flex justify-between items-center py-2.5 px-3.5 rounded-[10px] bg-[var(--color-brand-gray)]">
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-6 h-6 rounded-md bg-[rgba(0,98,255,0.1)] flex items-center justify-center text-xs text-[var(--color-brand-blue)] font-bold">{i + 1}</span>
                                        <span className="text-sm text-[var(--color-main-text)]">{p.name}</span>
                                    </div>
                                    <span className="text-[13px] text-[var(--color-inactive-text)]">{p.views} views</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Top Startups */}
                <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                    <div className="flex items-center gap-2 mb-4">
                        <Store size={18} color="#F59E0B" strokeWidth={2} />
                        <h3 className="text-base font-semibold text-[var(--color-main-text)]">Startup Terpopuler</h3>
                    </div>
                    {data.topStartups.length === 0 ? (
                        <p className="text-[var(--color-inactive-text)] text-[13px]">Belum ada data</p>
                    ) : (
                        <div className="flex flex-col gap-2.5">
                            {data.topStartups.map((s, i) => (
                                <div key={i} className="flex justify-between items-center py-2.5 px-3.5 rounded-[10px] bg-[var(--color-brand-gray)]">
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-6 h-6 rounded-md bg-[rgba(245,158,11,0.1)] flex items-center justify-center text-xs text-amber-500 font-bold">{i + 1}</span>
                                        <span className="text-sm text-[var(--color-main-text)]">{s.name}</span>
                                    </div>
                                    <span className="text-[13px] text-[var(--color-inactive-text)]">{s.views} views</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Page Views */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-2 mb-4">
                    <Clock size={18} color="#8B5CF6" strokeWidth={2} />
                    <h3 className="text-base font-semibold text-[var(--color-main-text)]">Aktivitas Terbaru</h3>
                </div>
                {data.recentPageViews.length === 0 ? (
                    <p className="text-[var(--color-inactive-text)] text-[13px]">Belum ada aktivitas</p>
                ) : (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-2.5 text-xs text-[var(--color-inactive-text)] font-medium">Halaman</th>
                                <th className="text-right py-2.5 text-xs text-[var(--color-inactive-text)] font-medium">Waktu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.recentPageViews.map((pv) => (
                                <tr key={pv.id} className="border-b border-gray-100">
                                    <td className="py-2.5 text-[13px] text-[var(--color-main-text)]">{pv.page}</td>
                                    <td className="py-2.5 text-xs text-[var(--color-inactive-text)] text-right">
                                        {new Date(pv.createdAt).toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
