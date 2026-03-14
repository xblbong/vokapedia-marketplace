"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/src/lib/auth";
import { useState } from "react";
import {
    LayoutDashboard,
    Package,
    Building2,
    Tag,
    GraduationCap,
    Users,
    LogOut,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
} from "lucide-react";
import Image from "next/image";

const MENU_ITEMS = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Produk", href: "/admin/products", icon: Package },
    { name: "Startup", href: "/admin/startups", icon: Building2 },
    { name: "Kategori", href: "/admin/categories", icon: Tag },
    { name: "Program Studi", href: "/admin/program-studi", icon: GraduationCap },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Rekap Startup", href: "/admin/recap-startups", icon: ClipboardList },
];

export default function AdminSidebar({ userName, userRole }: { userName: string; userRole: string }) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === "/admin";
        return pathname.startsWith(href);
    };

    return (
        <aside
            className={`fixed top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out border-r border-[var(--color-border-gray)] bg-[var(--color-nav-bg)] flex flex-col nav-shadow`}
            style={{
                width: collapsed ? 72 : 260,
                minHeight: "100vh",
            }}
        >
            {/* Header - Logo Section */}
            <div className={`relative flex items-center h-[80px] py-6 px-6 border-b border-[var(--color-border-gray)] ${collapsed ? "justify-center" : "justify-between"}`}>
                <Link href="/admin" className={`flex items-center transition-all duration-300 ${collapsed ? "w-10 overflow-hidden" : "w-full"}`}>
                    <Image
                        src="/images/svg/logo-vokapedia.svg"
                        alt="Vokapedia Logo"
                        width={180}
                        height={40}
                        className={`object-contain transition-all ${collapsed ? "min-w-[150px] -translate-x-[5px]" : "w-auto"}`}
                        priority
                    />
                </Link>

                {/* Toggle Button */}
                {!collapsed && (
                    <button
                        onClick={() => setCollapsed(true)}
                        className="p-1.5 rounded-lg hover:bg-[var(--color-brand-gray)] text-[var(--color-inactive-text)] transition-colors cursor-pointer"
                    >
                        <ChevronLeft size={20} />
                    </button>
                )}
            </div>

            {/* Tombol Expand saat Collapsed */}
            {collapsed && (
                <button
                    onClick={() => setCollapsed(false)}
                    className="absolute -right-3 top-9 bg-white border border-[var(--color-border-gray)] rounded-full p-1 text-[var(--color-brand-blue)] shadow-sm z-[60] cursor-pointer hover:scale-110 transition-transform"
                >
                    <ChevronRight size={14} />
                </button>
            )}

            {/* Menu */}
            <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
                {MENU_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
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
                                fontWeight: active ? 600 : 400,
                                color: active ? "#0062FF" : "#8F8F8F",
                                background: active ? "rgba(0,98,255,0.08)" : "transparent",
                                border: active ? "1px solid rgba(0,98,255,0.15)" : "1px solid transparent",
                                transition: "all 0.2s",
                                justifyContent: collapsed ? "center" : "flex-start",
                            }}
                        >
                            <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
                            {!collapsed && <span>{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer - User Info */}
            <div style={{
                padding: collapsed ? "16px 12px" : "16px 20px",
                borderTop: "1px solid #E5E7EB",
                display: "flex",
                flexDirection: "column",
                gap: 12,
            }}>
                {!collapsed && (
                    <div>
                        <p style={{ color: "#1E1E1E", fontSize: 13, fontWeight: 600, margin: 0 }}>{userName}</p>
                        <p style={{ color: "#8F8F8F", fontSize: 11, margin: "2px 0 0", textTransform: "capitalize" }}>{userRole}</p>
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
                            background: "rgba(239,68,68,0.06)",
                            color: "#EF4444",
                            fontSize: 12,
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                        }}
                    >
                        <LogOut size={14} />
                        {!collapsed && "Logout"}
                    </button>
                </form>
            </div>
        </aside>
    );
}
