import { prisma } from "@/src/lib/prisma";
import { requireAuth } from "@/src/lib/auth";
import AdminCrudTable from "@/src/components/admin/AdminCrudTable";
import { Users, AlertTriangle } from "lucide-react";

export default async function AdminUsersPage() {
    const currentUser = await requireAuth();
    const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, createdAt: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div>
            <div className="flex items-center gap-2.5 mb-6">
                <div className="w-9 h-9 rounded-[10px] bg-[rgba(139,92,246,0.08)] flex items-center justify-center">
                    <Users size={20} color="#8B5CF6" strokeWidth={2} />
                </div>
                <h1 className="text-[28px] font-bold text-[var(--color-main-text)]">Kelola Users</h1>
            </div>
            {currentUser.role !== "ADMINISTRATOR" && (
                <div className="py-3 px-4 rounded-[10px] mb-5 bg-amber-500/[0.06] border border-amber-500/20 text-amber-700 text-[13px] flex items-center gap-2">
                    <AlertTriangle size={16} />
                    Anda login sebagai Supervisor. Hanya Administrator yang bisa menambah atau menghapus user.
                </div>
            )}
            <AdminCrudTable
                type="user"
                userRole={currentUser.role}
                data={users.map(u => ({
                    id: u.id,
                    name: u.name,
                    email: u.email,
                    role: u.role,
                    createdAt: new Date(u.createdAt).toLocaleDateString("id-ID"),
                }))}
                columns={["name", "email", "role", "createdAt"]}
                columnLabels={["Nama", "Email", "Role", "Dibuat"]}
                formFields={[
                    { name: "name", label: "Username", type: "text", required: true, minLength: 7 },
                    { name: "email", label: "Email", type: "email", required: true },
                    { name: "password", label: "Password", type: "password", required: true },
                    {
                        name: "role", label: "Role", type: "select", options: [
                            { value: "ADMINISTRATOR", label: "Administrator" },
                            { value: "SUPERVISOR", label: "Supervisor" },
                        ], required: true
                    },
                ]}
            />
        </div>
    );
}
