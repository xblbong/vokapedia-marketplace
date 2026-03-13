"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, X, Check } from "lucide-react";
import {
    createProduct, updateProduct, deleteProduct,
    createStartup, updateStartup, deleteStartup,
    createCategory, updateCategory, deleteCategory,
    createProgramStudi, updateProgramStudi, deleteProgramStudi,
    createUser, deleteUser,
    createTeamMember, deleteTeamMember,
} from "@/src/lib/admin-actions";

interface FormField {
    name: string;
    label: string;
    type: "text" | "textarea" | "number" | "select" | "email" | "password";
    required?: boolean;
    options?: { value: string; label: string }[];
}

interface Props {
    type: "product" | "startup" | "category" | "program-studi" | "user" | "team-member";
    data: Record<string, unknown>[];
    columns: string[];
    columnLabels: string[];
    formFields: FormField[];
    userRole?: string;
    parentId?: number;
}

const deleteActions: Record<string, (id: number) => Promise<unknown>> = {
    product: deleteProduct,
    startup: deleteStartup,
    category: deleteCategory,
    "program-studi": deleteProgramStudi,
    user: deleteUser,
    "team-member": deleteTeamMember,
};

const createActions: Record<string, (formData: FormData) => Promise<unknown>> = {
    product: createProduct,
    startup: createStartup,
    category: createCategory,
    "program-studi": createProgramStudi,
    user: createUser,
    "team-member": createTeamMember,
};

const updateActions: Record<string, (id: number, formData: FormData) => Promise<unknown>> = {
    product: updateProduct,
    startup: updateStartup,
    category: updateCategory,
    "program-studi": updateProgramStudi,
};

export default function AdminCrudTable({ type, data, columns, columnLabels, formFields, userRole, parentId }: Props) {
    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const canCreate = type === "user" ? userRole === "ADMINISTRATOR" : true;
    const canEdit = type in updateActions;

    async function handleCreate(formData: FormData) {
        setLoading(true);
        setError("");
        if (parentId) formData.set("startupId", String(parentId));
        try {
            const result = await createActions[type](formData);
            if (result && typeof result === "object" && "error" in result) {
                setError((result as { error: string }).error);
            } else {
                setShowForm(false);
                router.refresh();
            }
        } catch {
            setError("Gagal menyimpan data");
        }
        setLoading(false);
    }

    async function handleUpdate(id: number, formData: FormData) {
        setLoading(true);
        setError("");
        try {
            const result = await updateActions[type](id, formData);
            if (result && typeof result === "object" && "error" in result) {
                setError((result as { error: string }).error);
            } else {
                setEditingId(null);
                router.refresh();
            }
        } catch {
            setError("Gagal mengupdate data");
        }
        setLoading(false);
    }

    async function handleDelete(id: number) {
        if (!confirm("Yakin ingin menghapus?")) return;
        try {
            await deleteActions[type](id);
            router.refresh();
        } catch {
            alert("Gagal menghapus");
        }
    }

    const inputStyle: React.CSSProperties = {
        width: "100%", padding: "10px 14px", borderRadius: 8,
        border: "1px solid #C3C3C3", background: "#FFFFFF",
        color: "#1E1E1E", fontSize: 14, outline: "none", boxSizing: "border-box",
    };

    const renderFormFields = (row?: Record<string, unknown>) => (
        <>
            {formFields.map((field) => (
                <div key={field.name} style={{ gridColumn: field.type === "textarea" ? "1 / -1" : "auto" }}>
                    <label style={{ display: "block", color: "#8F8F8F", fontSize: 12, marginBottom: 6, fontWeight: 500 }}>
                        {field.label} {field.required && <span style={{ color: "#FF0000" }}>*</span>}
                    </label>
                    {field.type === "textarea" ? (
                        <textarea
                            name={field.name}
                            required={field.required}
                            rows={3}
                            defaultValue={row ? String(row[field.name] ?? "") : ""}
                            style={{ ...inputStyle, resize: "vertical" }}
                        />
                    ) : field.type === "select" ? (
                        <select
                            name={field.name}
                            required={field.required}
                            defaultValue={row ? String(row[field.name] ?? "") : ""}
                            style={inputStyle}
                        >
                            <option value="">Pilih {field.label}</option>
                            {field.options?.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    ) : (
                        <input
                            name={field.name}
                            type={field.type}
                            required={field.required}
                            defaultValue={row ? String(row[field.name] ?? "") : ""}
                            style={inputStyle}
                        />
                    )}
                </div>
            ))}
        </>
    );

    return (
        <div>
            {/* Add Button */}
            {canCreate && (
                <button
                    onClick={() => { setShowForm(!showForm); setEditingId(null); }}
                    style={{
                        padding: "10px 20px", borderRadius: 10, border: "none",
                        background: showForm ? "rgba(239,68,68,0.08)" : "linear-gradient(135deg, #0062FF, #3B82F6)",
                        color: showForm ? "#EF4444" : "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 20,
                        transition: "all 0.2s",
                        display: "flex", alignItems: "center", gap: 6,
                    }}
                >
                    {showForm ? <><X size={16} /> Batal</> : <><Plus size={16} /> Tambah Baru</>}
                </button>
            )}

            {/* Error */}
            {error && (
                <div style={{ padding: "10px 16px", borderRadius: 8, background: "rgba(255,0,0,0.06)", border: "1px solid rgba(255,0,0,0.2)", color: "#FF0000", fontSize: 13, marginBottom: 16 }}>
                    {error}
                </div>
            )}

            {/* Create Form */}
            {showForm && (
                <form
                    action={handleCreate}
                    style={{
                        padding: 24, borderRadius: 16, marginBottom: 24,
                        background: "#FFFFFF", border: "1px solid #E5E7EB",
                        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}
                >
                    {renderFormFields()}
                    <div style={{ gridColumn: "1 / -1" }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: "12px 24px", borderRadius: 10, border: "none",
                                background: loading ? "rgba(0,98,255,0.5)" : "linear-gradient(135deg, #0062FF, #3B82F6)",
                                color: "#fff", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                                display: "flex", alignItems: "center", gap: 6,
                            }}
                        >
                            {loading ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            )}

            {/* Data Table */}
            <div style={{
                borderRadius: 16, overflow: "hidden",
                background: "#FFFFFF", border: "1px solid #E5E7EB",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                            <th style={{ textAlign: "left", padding: "14px 20px", fontSize: 12, color: "#8F8F8F", fontWeight: 600 }}>#</th>
                            {columnLabels.map((label) => (
                                <th key={label} style={{ textAlign: "left", padding: "14px 16px", fontSize: 12, color: "#8F8F8F", fontWeight: 600 }}>{label}</th>
                            ))}
                            <th style={{ textAlign: "right", padding: "14px 20px", fontSize: 12, color: "#8F8F8F", fontWeight: 600 }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + 2} style={{ padding: 40, textAlign: "center", color: "#8F8F8F", fontSize: 14 }}>
                                    Belum ada data
                                </td>
                            </tr>
                        ) : (
                            data.map((row, i) => {
                                const isEditing = editingId === (row.id as number);
                                return isEditing ? (
                                    <tr key={row.id as number} style={{ borderBottom: "1px solid #E5E7EB", background: "#F8FAFC" }}>
                                        <td colSpan={columns.length + 2} style={{ padding: "16px 20px" }}>
                                            <form
                                                action={(formData) => handleUpdate(row.id as number, formData)}
                                                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
                                            >
                                                {renderFormFields(row)}
                                                <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8, marginTop: 4 }}>
                                                    <button
                                                        type="submit"
                                                        disabled={loading}
                                                        style={{
                                                            padding: "8px 16px", borderRadius: 8, border: "none",
                                                            background: "#0062FF", color: "#fff", fontSize: 13, fontWeight: 600,
                                                            cursor: loading ? "not-allowed" : "pointer",
                                                            display: "flex", alignItems: "center", gap: 4,
                                                        }}
                                                    >
                                                        <Check size={14} /> {loading ? "Menyimpan..." : "Simpan"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingId(null)}
                                                        style={{
                                                            padding: "8px 16px", borderRadius: 8,
                                                            border: "1px solid #C3C3C3", background: "#FFFFFF",
                                                            color: "#8F8F8F", fontSize: 13, fontWeight: 500, cursor: "pointer",
                                                            display: "flex", alignItems: "center", gap: 4,
                                                        }}
                                                    >
                                                        <X size={14} /> Batal
                                                    </button>
                                                </div>
                                            </form>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr key={row.id as number} style={{ borderBottom: "1px solid #F3F4F6" }}>
                                        <td style={{ padding: "12px 20px", fontSize: 13, color: "#8F8F8F" }}>{i + 1}</td>
                                        {columns.map((col) => (
                                            <td key={col} style={{ padding: "12px 16px", fontSize: 14, color: "#1E1E1E" }}>
                                                {String(row[col] ?? "-")}
                                            </td>
                                        ))}
                                        <td style={{ padding: "12px 20px", textAlign: "right" }}>
                                            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                                                {canEdit && (
                                                    <button
                                                        onClick={() => { setEditingId(row.id as number); setShowForm(false); setError(""); }}
                                                        style={{
                                                            padding: "6px 10px", borderRadius: 6,
                                                            border: "1px solid rgba(0,98,255,0.2)",
                                                            background: "rgba(0,98,255,0.06)", color: "#0062FF",
                                                            fontSize: 12, cursor: "pointer",
                                                            display: "flex", alignItems: "center", gap: 4,
                                                        }}
                                                    >
                                                        <Pencil size={12} /> Edit
                                                    </button>
                                                )}
                                                {(type !== "user" || userRole === "ADMINISTRATOR") && (
                                                    <button
                                                        onClick={() => handleDelete(row.id as number)}
                                                        style={{
                                                            padding: "6px 10px", borderRadius: 6,
                                                            border: "1px solid rgba(239,68,68,0.2)",
                                                            background: "rgba(239,68,68,0.06)", color: "#EF4444",
                                                            fontSize: 12, cursor: "pointer",
                                                            display: "flex", alignItems: "center", gap: 4,
                                                        }}
                                                    >
                                                        <Trash2 size={12} /> Hapus
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
