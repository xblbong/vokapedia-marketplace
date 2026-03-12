import { requireAuth } from "@/src/lib/auth";
import AdminSidebar from "@/src/components/admin/AdminSidebar";

export const metadata = {
    title: "Admin Dashboard | Vokapedia",
};

export default async function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await requireAuth();

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a1a" }}>
            <AdminSidebar userName={user.name} userRole={user.role} />
            <main style={{
                flex: 1,
                marginLeft: 260,
                padding: "32px",
                color: "#fff",
                transition: "margin-left 0.3s ease",
            }}>
                {children}
            </main>
        </div>
    );
}
