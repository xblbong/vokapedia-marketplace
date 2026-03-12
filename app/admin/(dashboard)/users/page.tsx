import { prisma } from "@/src/lib/prisma";
import { requireAuth } from "@/src/lib/auth";
import AdminCrudTable from "@/src/components/admin/AdminCrudTable";

export default async function AdminUsersPage() {
    const currentUser = await requireAuth();
    const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, createdAt: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>👥 Kelola Users</h1>
            {currentUser.role !== "ADMINISTRATOR" && (
                <div style={{
                    padding: "12px 16px", borderRadius: 10, marginBottom: 20,
                    background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)",
                    color: "#fcd34d", fontSize: 13,
                }}>
                    ⚠️ Anda login sebagai Supervisor. Hanya Administrator yang bisa menambah atau menghapus user.
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
                    { name: "name", label: "Nama", type: "text", required: true },
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
