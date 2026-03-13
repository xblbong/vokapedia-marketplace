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
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: "#1E1E1E" }}>Dashboard</h1>
            <p style={{ color: "#8F8F8F", fontSize: 14, marginBottom: 32 }}>Selamat datang di Vokapedia Admin Panel</p>

            {/* Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
                {statCards.map((card) => {
                    const Icon = iconMap[card.label];
                    return (
                        <div key={card.label} style={{
                            padding: "24px", borderRadius: 16,
                            background: "#FFFFFF",
                            border: "1px solid #E5E7EB",
                            transition: "all 0.2s",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: 10,
                                    background: `${card.color}12`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    {Icon && <Icon size={20} color={card.color} strokeWidth={2} />}
                                </div>
                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: card.color }} />
                            </div>
                            <p style={{ fontSize: 32, fontWeight: 700, margin: "0 0 4px", color: "#1E1E1E" }}>{card.value}</p>
                            <p style={{ fontSize: 13, color: "#8F8F8F", margin: 0 }}>{card.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Top Products & Startups */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
                {/* Top Products */}
                <div style={{
                    padding: "24px", borderRadius: 16,
                    background: "#FFFFFF", border: "1px solid #E5E7EB",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                        <TrendingUp size={18} color="#0062FF" strokeWidth={2} />
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1E1E1E", margin: 0 }}>Produk Terpopuler</h3>
                    </div>
                    {data.topProducts.length === 0 ? (
                        <p style={{ color: "#8F8F8F", fontSize: 13 }}>Belum ada data</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {data.topProducts.map((p, i) => (
                                <div key={i} style={{
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                    padding: "10px 14px", borderRadius: 10,
                                    background: "#F8FAFC",
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <span style={{ width: 24, height: 24, borderRadius: 6, background: "rgba(0,98,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#0062FF", fontWeight: 700 }}>{i + 1}</span>
                                        <span style={{ fontSize: 14, color: "#1E1E1E" }}>{p.name}</span>
                                    </div>
                                    <span style={{ fontSize: 13, color: "#8F8F8F" }}>{p.views} views</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Top Startups */}
                <div style={{
                    padding: "24px", borderRadius: 16,
                    background: "#FFFFFF", border: "1px solid #E5E7EB",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                        <Store size={18} color="#F59E0B" strokeWidth={2} />
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1E1E1E", margin: 0 }}>Startup Terpopuler</h3>
                    </div>
                    {data.topStartups.length === 0 ? (
                        <p style={{ color: "#8F8F8F", fontSize: 13 }}>Belum ada data</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {data.topStartups.map((s, i) => (
                                <div key={i} style={{
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                    padding: "10px 14px", borderRadius: 10,
                                    background: "#F8FAFC",
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <span style={{ width: 24, height: 24, borderRadius: 6, background: "rgba(245,158,11,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#F59E0B", fontWeight: 700 }}>{i + 1}</span>
                                        <span style={{ fontSize: 14, color: "#1E1E1E" }}>{s.name}</span>
                                    </div>
                                    <span style={{ fontSize: 13, color: "#8F8F8F" }}>{s.views} views</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Page Views */}
            <div style={{
                padding: "24px", borderRadius: 16,
                background: "#FFFFFF", border: "1px solid #E5E7EB",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <Clock size={18} color="#8B5CF6" strokeWidth={2} />
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1E1E1E", margin: 0 }}>Aktivitas Terbaru</h3>
                </div>
                {data.recentPageViews.length === 0 ? (
                    <p style={{ color: "#8F8F8F", fontSize: 13 }}>Belum ada aktivitas</p>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                                <th style={{ textAlign: "left", padding: "10px 0", fontSize: 12, color: "#8F8F8F", fontWeight: 500 }}>Halaman</th>
                                <th style={{ textAlign: "right", padding: "10px 0", fontSize: 12, color: "#8F8F8F", fontWeight: 500 }}>Waktu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.recentPageViews.map((pv) => (
                                <tr key={pv.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                                    <td style={{ padding: "10px 0", fontSize: 13, color: "#1E1E1E" }}>{pv.page}</td>
                                    <td style={{ padding: "10px 0", fontSize: 12, color: "#8F8F8F", textAlign: "right" }}>
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
