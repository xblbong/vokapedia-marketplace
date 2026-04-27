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
        <div className="flex min-h-screen bg-page-bg">
            <AdminSidebar userName={user.name} userRole={user.role} />
            
            {/* Main Content */}
            <main className="flex-1 lg:ml-[260px] pt-24 lg:pt-0 p-4 md:p-8 text-main-text transition-[margin-left] duration-300 ease-in-out min-w-0">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
