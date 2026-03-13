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
        <div style={{ display: "flex", minHeight: "100vh", background: "#F6F6F6" }}>
            <AdminSidebar userName={user.name} userRole={user.role} />
            <main style={{
                flex: 1,
                marginLeft: 260,
                padding: "32px",
                color: "#1E1E1E",
                transition: "margin-left 0.3s ease",
            }}>
                {children}
            </main>
        </div>
    );
}
