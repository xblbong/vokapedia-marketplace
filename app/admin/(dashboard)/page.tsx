import { prisma } from "@/src/lib/prisma";
import { requireAuth } from "@/src/lib/auth";

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

    // Get product names for top products
    const topProductsWithNames = await Promise.all(
        topProducts.map(async (p) => {
            const product = await prisma.product.findUnique({ where: { id: p.productId }, select: { title: true } });
            return { name: product?.title || "Unknown", views: p._count.productId };
        })
    );

    // Get startup names for top startups
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

export default async function AdminDashboard() {
    await requireAuth();
    const data = await getAnalytics();

    const statCards = [
        { label: "Total Pengunjung", value: data.totalPageViews, icon: "📊", color: "#0062FF" },
        { label: "Total Produk", value: data.totalProducts, icon: "📦", color: "#10B981" },
        { label: "Total Startup", value: data.totalStartups, icon: "🏢", color: "#F59E0B" },
        { label: "Total Admin", value: data.totalUsers, icon: "👥", color: "#8B5CF6" },
        { label: "Klik WhatsApp", value: data.totalWhatsappClicks, icon: "📱", color: "#25D366" },
        { label: "Klik E-commerce", value: data.totalEcommerceClicks, icon: "🛒", color: "#EF4444" },
    ];

    return (
        <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Dashboard</h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 32 }}>Selamat datang di Vokapedia Admin Panel</p>

            {/* Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
                {statCards.map((card) => (
                    <div key={card.label} style={{
                        padding: "24px", borderRadius: 16,
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        transition: "all 0.2s",
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                            <span style={{ fontSize: 28 }}>{card.icon}</span>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: card.color }} />
                        </div>
                        <p style={{ fontSize: 32, fontWeight: 700, margin: "0 0 4px", color: "#fff" }}>{card.value}</p>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0 }}>{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Top Products & Startups */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
                {/* Top Products */}
                <div style={{
                    padding: "24px", borderRadius: 16,
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: "#fff" }}>📈 Produk Terpopuler</h3>
                    {data.topProducts.length === 0 ? (
                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Belum ada data</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {data.topProducts.map((p, i) => (
                                <div key={i} style={{
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                    padding: "10px 14px", borderRadius: 10,
                                    background: "rgba(255,255,255,0.03)",
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <span style={{ width: 24, height: 24, borderRadius: 6, background: "rgba(0,98,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#60A5FA", fontWeight: 700 }}>{i + 1}</span>
                                        <span style={{ fontSize: 14, color: "#fff" }}>{p.name}</span>
                                    </div>
                                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{p.views} views</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Top Startups */}
                <div style={{
                    padding: "24px", borderRadius: 16,
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: "#fff" }}>🏪 Toko Terpopuler</h3>
                    {data.topStartups.length === 0 ? (
                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Belum ada data</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {data.topStartups.map((s, i) => (
                                <div key={i} style={{
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                    padding: "10px 14px", borderRadius: 10,
                                    background: "rgba(255,255,255,0.03)",
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <span style={{ width: 24, height: 24, borderRadius: 6, background: "rgba(245,158,11,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#FBBF24", fontWeight: 700 }}>{i + 1}</span>
                                        <span style={{ fontSize: 14, color: "#fff" }}>{s.name}</span>
                                    </div>
                                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{s.views} views</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Page Views */}
            <div style={{
                padding: "24px", borderRadius: 16,
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
            }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: "#fff" }}>📅 Aktivitas Terbaru</h3>
                {data.recentPageViews.length === 0 ? (
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Belum ada aktivitas</p>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                                <th style={{ textAlign: "left", padding: "10px 0", fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Halaman</th>
                                <th style={{ textAlign: "right", padding: "10px 0", fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Waktu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.recentPageViews.map((pv) => (
                                <tr key={pv.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                    <td style={{ padding: "10px 0", fontSize: 13, color: "#fff" }}>{pv.page}</td>
                                    <td style={{ padding: "10px 0", fontSize: 12, color: "rgba(255,255,255,0.5)", textAlign: "right" }}>
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
