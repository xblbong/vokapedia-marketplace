"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/src/lib/auth";
import { useState } from "react";

const MENU_ITEMS = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Produk", href: "/admin/products", icon: "📦" },
    { name: "Startup", href: "/admin/startups", icon: "🏢" },
    { name: "Kategori", href: "/admin/categories", icon: "🏷️" },
    { name: "Program Studi", href: "/admin/program-studi", icon: "🎓" },
    { name: "Users", href: "/admin/users", icon: "👥" },
];

export default function AdminSidebar({ userName, userRole }: { userName: string; userRole: string }) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === "/admin";
        return pathname.startsWith(href);
    };

    return (
        <aside style={{
            width: collapsed ? 72 : 260,
            minHeight: "100vh",
            background: "#0f0f23",
            borderRight: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            flexDirection: "column",
            transition: "width 0.3s ease",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 50,
        }}>
            {/* Header */}
            <div style={{
                padding: collapsed ? "20px 16px" : "20px 24px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                gap: 12,
                justifyContent: collapsed ? "center" : "space-between",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: "linear-gradient(135deg, #0062FF, #3B82F6)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
                    </div>
                    {!collapsed && <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Vokapedia</span>}
                </div>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 18, padding: 4 }}
                >
                    {collapsed ? "→" : "←"}
                </button>
            </div>

            {/* Menu */}
            <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
                {MENU_ITEMS.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: collapsed ? "12px" : "10px 16px",
                            borderRadius: 10,
                            textDecoration: "none",
                            fontSize: 14,
                            fontWeight: isActive(item.href) ? 600 : 400,
                            color: isActive(item.href) ? "#fff" : "rgba(255,255,255,0.6)",
                            background: isActive(item.href) ? "rgba(0,98,255,0.2)" : "transparent",
                            border: isActive(item.href) ? "1px solid rgba(0,98,255,0.3)" : "1px solid transparent",
                            transition: "all 0.2s",
                            justifyContent: collapsed ? "center" : "flex-start",
                        }}
                    >
                        <span style={{ fontSize: 18 }}>{item.icon}</span>
                        {!collapsed && <span>{item.name}</span>}
                    </Link>
                ))}
            </nav>

            {/* Footer - User Info */}
            <div style={{
                padding: collapsed ? "16px 12px" : "16px 20px",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
            }}>
                {!collapsed && (
                    <div>
                        <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: 0 }}>{userName}</p>
                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, margin: "2px 0 0" }}>{userRole}</p>
                    </div>
                )}
                <form action={logoutAdmin}>
                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: 8,
                            border: "1px solid rgba(239,68,68,0.3)",
                            background: "rgba(239,68,68,0.1)",
                            color: "#fca5a5",
                            fontSize: 12,
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                    >
                        {collapsed ? "🚪" : "Logout"}
                    </button>
                </form>
            </div>
        </aside>
    );
}
