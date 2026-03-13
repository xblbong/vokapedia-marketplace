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
        <div className="flex min-h-screen bg-[var(--color-page-bg)]">
            <AdminSidebar userName={user.name} userRole={user.role} />
            <main className="flex-1 ml-[260px] p-8 text-[var(--color-main-text)] transition-[margin-left] duration-300 ease-in-out">
                {children}
            </main>
        </div>
    );
}
