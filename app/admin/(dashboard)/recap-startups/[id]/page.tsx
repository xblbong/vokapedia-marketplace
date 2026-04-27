import { prisma } from "@/src/lib/prisma";
import { requireAuth } from "@/src/lib/auth";
import { notFound } from "next/navigation";
import {
    ArrowLeft, Building2, Users, Package, Globe, Instagram, ImageIcon,
} from "lucide-react";
import Link from "next/link";

function formatRupiah(value: number): string {
    return "Rp " + Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default async function RecapStartupDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await requireAuth();

    const { id } = await params;
    const startupId = parseInt(id);
    if (isNaN(startupId)) notFound();

    const startup = await prisma.startup.findUnique({
        where: { id: startupId },
        include: {
            programStudi: true,
            teamMembers: true,
            products: {
                include: { category: { select: { name: true } } },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!startup) notFound();

    return (
        <div>
            {/* Back button */}
            <Link href="/admin/recap-startups" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                textDecoration: "none", color: "#0062FF", fontSize: 14,
                fontWeight: 500, marginBottom: 20,
            }}>
                <ArrowLeft size={16} /> Kembali ke Rekap Startup
            </Link>

            {/* Banner & Profile */}
            <div style={{
                borderRadius: 16, overflow: "hidden", background: "#FFFFFF",
                border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                marginBottom: 24,
            }}>
                {/* Banner */}
                <div style={{
                    height: 180,
                    background: startup.bannerImage
                        ? `url(${startup.bannerImage}) center/cover`
                        : "linear-gradient(135deg, #0062FF20, #3B82F620)",
                    position: "relative",
                }}>
                    <div style={{
                        position: "absolute", bottom: -32, left: 24,
                        width: 72, height: 72, borderRadius: 16,
                        border: "4px solid white", overflow: "hidden",
                        background: "#F3F4F6", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}>
                        {startup.profileImage ? (
                            <img src={startup.profileImage} alt={startup.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                            <div style={{
                                width: "100%", height: "100%", display: "flex",
                                alignItems: "center", justifyContent: "center",
                            }}>
                                <Building2 size={28} color="#8F8F8F" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Startup Info */}
                <div style={{ padding: "44px 24px 24px" }}>
                    <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 700, color: "#1E1E1E" }}>
                        {startup.name}
                    </h1>
                    <p style={{ margin: "0 0 8px", fontSize: 14, color: "#0062FF", fontWeight: 500 }}>
                        {startup.programStudi?.name ?? "Program Studi Lainnya"}
                    </p>
                    <p style={{ margin: "0 0 16px", fontSize: 14, color: "#6B7280", lineHeight: 1.6 }}>
                        {startup.description || "Tidak ada deskripsi"}
                    </p>

                    {/* Stats */}
                    <div style={{ display: "flex", gap: 24 }}>
                        <div style={{
                            padding: "10px 16px", borderRadius: 10,
                            background: "rgba(0,98,255,0.06)", border: "1px solid rgba(0,98,255,0.1)",
                            display: "flex", alignItems: "center", gap: 8,
                        }}>
                            <Users size={16} color="#0062FF" />
                            <span style={{ fontSize: 14, fontWeight: 600, color: "#0062FF" }}>{startup.teamMembers.length}</span>
                            <span style={{ fontSize: 13, color: "#8F8F8F" }}>Anggota</span>
                        </div>
                        <div style={{
                            padding: "10px 16px", borderRadius: 10,
                            background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.1)",
                            display: "flex", alignItems: "center", gap: 8,
                        }}>
                            <Package size={16} color="#10B981" />
                            <span style={{ fontSize: 14, fontWeight: 600, color: "#10B981" }}>{startup.products.length}</span>
                            <span style={{ fontSize: 13, color: "#8F8F8F" }}>Produk</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Members */}
            <div style={{
                borderRadius: 16, background: "#FFFFFF", border: "1px solid #E5E7EB",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)", padding: 24, marginBottom: 24,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                    <Users size={18} color="#0062FF" />
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1E1E1E" }}>Anggota Tim</h2>
                </div>

                {startup.teamMembers.length === 0 ? (
                    <p style={{ color: "#8F8F8F", fontSize: 14 }}>Belum ada anggota tim</p>
                ) : (
                    <div style={{
                        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12,
                    }}>
                        {startup.teamMembers.map((m) => (
                            <div key={m.id} style={{
                                padding: 16, borderRadius: 12, background: "#F8FAFC",
                                border: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 12,
                            }}>
                                {m.photo ? (
                                    <img src={m.photo} alt={m.name} style={{
                                        width: 44, height: 44, borderRadius: 10, objectFit: "cover",
                                        border: "1px solid #E5E7EB",
                                    }} />
                                ) : (
                                    <div style={{
                                        width: 44, height: 44, borderRadius: 10, background: "#E5E7EB",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                        <Users size={18} color="#8F8F8F" />
                                    </div>
                                )}
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#1E1E1E" }}>{m.name}</p>
                                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#8F8F8F" }}>{m.role}</p>
                                    {m.instagramUrl && (
                                        <a href={m.instagramUrl} target="_blank" rel="noopener noreferrer"
                                            style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 4, fontSize: 11, color: "#8F8F8F", textDecoration: "none" }}>
                                            <Instagram size={11} /> Instagram
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Products */}
            <div style={{
                borderRadius: 16, background: "#FFFFFF", border: "1px solid #E5E7EB",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)", overflow: "hidden",
            }}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 8 }}>
                    <Package size={18} color="#10B981" />
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1E1E1E" }}>Daftar Produk</h2>
                </div>

                {startup.products.length === 0 ? (
                    <div style={{ padding: 40, textAlign: "center" }}>
                        <p style={{ color: "#8F8F8F", fontSize: 14 }}>Belum ada produk</p>
                    </div>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                                <th style={{ textAlign: "left", padding: "14px 20px", fontSize: 12, color: "#8F8F8F", fontWeight: 600 }}>#</th>
                                <th style={{ textAlign: "left", padding: "14px 16px", fontSize: 12, color: "#8F8F8F", fontWeight: 600 }}>Gambar</th>
                                <th style={{ textAlign: "left", padding: "14px 16px", fontSize: 12, color: "#8F8F8F", fontWeight: 600 }}>Nama</th>
                                <th style={{ textAlign: "left", padding: "14px 16px", fontSize: 12, color: "#8F8F8F", fontWeight: 600 }}>Kategori</th>
                                <th style={{ textAlign: "left", padding: "14px 16px", fontSize: 12, color: "#8F8F8F", fontWeight: 600 }}>Harga</th>
                                <th style={{ textAlign: "left", padding: "14px 16px", fontSize: 12, color: "#8F8F8F", fontWeight: 600 }}>Stok</th>
                            </tr>
                        </thead>
                        <tbody>
                            {startup.products.map((p, i) => (
                                <tr key={p.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                                    <td style={{ padding: "12px 20px", fontSize: 13, color: "#8F8F8F" }}>{i + 1}</td>
                                    <td style={{ padding: "12px 16px" }}>
                                        {p.image ? (
                                            <img src={p.image.split(",")[0]} alt={p.title}
                                                style={{
                                                    width: 40, height: 40, objectFit: "cover",
                                                    borderRadius: 6, border: "1px solid #E5E7EB",
                                                }} />
                                        ) : (
                                            <div style={{
                                                width: 40, height: 40, borderRadius: 6, background: "#F3F4F6",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                            }}>
                                                <ImageIcon size={16} color="#8F8F8F" />
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ padding: "12px 16px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            {startup.profileImage && (
                                                <img
                                                    src={startup.profileImage}
                                                    alt={startup.name}
                                                    style={{
                                                        width: 28,
                                                        height: 28,
                                                        borderRadius: "999px",
                                                        objectFit: "cover",
                                                        border: "1px solid #E5E7EB",
                                                    }}
                                                />
                                            )}
                                            <span style={{ fontSize: 14, color: "#1E1E1E", fontWeight: 500 }}>
                                                {p.title}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: "12px 16px", fontSize: 14, color: "#8F8F8F" }}>{p.category.name}</td>
                                    <td style={{ padding: "12px 16px", fontSize: 14, color: "#1E1E1E" }}>{formatRupiah(Number(p.price))}</td>
                                    <td style={{ padding: "12px 16px", fontSize: 14, color: "#1E1E1E" }}>{p.stock}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
