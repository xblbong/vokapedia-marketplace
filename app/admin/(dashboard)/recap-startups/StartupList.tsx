'use client';

import Link from "next/link";
import { Building2, Users, Package } from "lucide-react";

type StartupListItem = {
    id: number;
    name: string;
    description: string | null;
    bannerImage: string | null;
    profileImage: string | null;
    programStudi: {
        name: string;
    };
    _count: {
        teamMembers: number;
        products: number;
    };
};

interface StartupListProps {
    startups: StartupListItem[];
}

export function StartupList({ startups }: StartupListProps) {
    if (startups.length === 0) {
        return (
            <div
                style={{
                    padding: 60,
                    textAlign: "center",
                    borderRadius: 16,
                    background: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                }}
            >
                <Building2
                    size={48}
                    color="#C3C3C3"
                    style={{ margin: "0 auto 12px" }}
                />
                <p style={{ color: "#8F8F8F", fontSize: 14 }}>
                    Belum ada data startup
                </p>
            </div>
        );
    }

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: 16,
            }}
        >
            {startups.map((s) => (
                <Link
                    key={s.id}
                    href={`/admin/recap-startups/${s.id}`}
                    style={{ textDecoration: "none" }}
                >
                    <div
                        style={{
                            borderRadius: 16,
                            overflow: "hidden",
                            background: "#FFFFFF",
                            border: "1px solid #E5E7EB",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                            transition: "all 0.2s",
                            cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                            const card = e.currentTarget as HTMLDivElement;
                            card.style.boxShadow =
                                "0 4px 12px rgba(0,0,0,0.08)";
                            card.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                            const card = e.currentTarget as HTMLDivElement;
                            card.style.boxShadow =
                                "0 1px 3px rgba(0,0,0,0.04)";
                            card.style.transform = "translateY(0)";
                        }}
                    >
                        {/* Banner */}
                        <div
                            style={{
                                height: 100,
                                background: s.bannerImage
                                    ? `url(${s.bannerImage}) center/cover`
                                    : "linear-gradient(135deg, #0062FF20, #3B82F620)",
                                position: "relative",
                            }}
                        >
                            {/* Profile overlay */}
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: -24,
                                    left: 20,
                                    width: 48,
                                    height: 48,
                                    borderRadius: 12,
                                    border: "3px solid white",
                                    overflow: "hidden",
                                    background: "#F3F4F6",
                                    boxShadow:
                                        "0 2px 8px rgba(0,0,0,0.1)",
                                }}
                            >
                                {s.profileImage ? (
                                    <img
                                        src={s.profileImage}
                                        alt={s.name}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Building2
                                            size={20}
                                            color="#8F8F8F"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div style={{ padding: "32px 20px 20px" }}>
                            <h3
                                style={{
                                    margin: "0 0 4px",
                                    fontSize: 16,
                                    fontWeight: 700,
                                    color: "#1E1E1E",
                                }}
                            >
                                {s.name}
                            </h3>
                            <p
                                style={{
                                    margin: "0 0 12px",
                                    fontSize: 12,
                                    color: "#8F8F8F",
                                }}
                            >
                                {s.programStudi?.name || "—"}
                            </p>
                            <p
                                style={{
                                    margin: "0 0 16px",
                                    fontSize: 13,
                                    color: "#6B7280",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                }}
                            >
                                {s.description || "Tidak ada deskripsi"}
                            </p>

                            {/* Stats */}
                            <div
                                style={{
                                    display: "flex",
                                    gap: 16,
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 6,
                                    }}
                                >
                                    <Users
                                        size={14}
                                        color="#8F8F8F"
                                    />
                                    <span
                                        style={{
                                            fontSize: 13,
                                            color: "#8F8F8F",
                                        }}
                                    >
                                        {s._count.teamMembers} Anggota
                                    </span>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 6,
                                    }}
                                >
                                    <Package
                                        size={14}
                                        color="#8F8F8F"
                                    />
                                    <span
                                        style={{
                                            fontSize: 13,
                                            color: "#8F8F8F",
                                        }}
                                    >
                                        {s._count.products} Produk
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}

