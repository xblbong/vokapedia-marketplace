"use client";

import { useState } from "react";
import { createProduct, updateProduct, deleteProduct, createStartup, updateStartup, deleteStartup, createCategory, updateCategory, deleteCategory, createProgramStudi, updateProgramStudi, deleteProgramStudi, createUser, deleteUser, createTeamMember, deleteTeamMember } from "@/src/lib/admin-actions";

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

export default function AdminCrudTable({ type, data, columns, columnLabels, formFields, userRole, parentId }: Props) {
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const canCreate = type === "user" ? userRole === "ADMINISTRATOR" : true;

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
            }
        } catch {
            setError("Gagal menyimpan data");
        }
        setLoading(false);
    }

    async function handleDelete(id: number) {
        if (!confirm("Yakin ingin menghapus?")) return;
        try {
            await deleteActions[type](id);
        } catch {
            alert("Gagal menghapus");
        }
    }

    const inputStyle = {
        width: "100%", padding: "10px 14px", borderRadius: 8,
        border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)",
        color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" as const,
    };

    return (
        <div>
            {/* Add Button */}
            {canCreate && (
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{
                        padding: "10px 20px", borderRadius: 10, border: "none",
                        background: showForm ? "rgba(239,68,68,0.2)" : "linear-gradient(135deg, #0062FF, #3B82F6)",
                        color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 20,
                        transition: "all 0.2s",
                    }}
                >
                    {showForm ? "✕ Batal" : "+ Tambah Baru"}
                </button>
            )}

            {/* Create Form */}
            {showForm && (
                <form
                    action={handleCreate}
                    style={{
                        padding: 24, borderRadius: 16, marginBottom: 24,
                        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16,
                    }}
                >
                    {error && (
                        <div style={{ gridColumn: "1 / -1", padding: "10px 16px", borderRadius: 8, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", fontSize: 13 }}>
                            {error}
                        </div>
                    )}
                    {formFields.map((field) => (
                        <div key={field.name} style={{ gridColumn: field.type === "textarea" ? "1 / -1" : "auto" }}>
                            <label style={{ display: "block", color: "rgba(255,255,255,0.7)", fontSize: 12, marginBottom: 6, fontWeight: 500 }}>
                                {field.label} {field.required && <span style={{ color: "#EF4444" }}>*</span>}
                            </label>
                            {field.type === "textarea" ? (
                                <textarea name={field.name} required={field.required} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
                            ) : field.type === "select" ? (
                                <select name={field.name} required={field.required} style={inputStyle}>
                                    <option value="">Pilih {field.label}</option>
                                    {field.options?.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            ) : (
                                <input name={field.name} type={field.type} required={field.required} style={inputStyle} />
                            )}
                        </div>
                    ))}
                    <div style={{ gridColumn: "1 / -1" }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: "12px 24px", borderRadius: 10, border: "none",
                                background: loading ? "rgba(0,98,255,0.5)" : "linear-gradient(135deg, #0062FF, #3B82F6)",
                                color: "#fff", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
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
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
            }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                            <th style={{ textAlign: "left", padding: "14px 20px", fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>#</th>
                            {columnLabels.map((label) => (
                                <th key={label} style={{ textAlign: "left", padding: "14px 16px", fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{label}</th>
                            ))}
                            <th style={{ textAlign: "right", padding: "14px 20px", fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + 2} style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
                                    Belum ada data
                                </td>
                            </tr>
                        ) : (
                            data.map((row, i) => (
                                <tr key={row.id as number} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                    <td style={{ padding: "12px 20px", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{i + 1}</td>
                                    {columns.map((col) => (
                                        <td key={col} style={{ padding: "12px 16px", fontSize: 14, color: "#fff" }}>
                                            {String(row[col] ?? "-")}
                                        </td>
                                    ))}
                                    <td style={{ padding: "12px 20px", textAlign: "right" }}>
                                        {(type !== "user" || userRole === "ADMINISTRATOR") && (
                                            <button
                                                onClick={() => handleDelete(row.id as number)}
                                                style={{
                                                    padding: "6px 12px", borderRadius: 6, border: "1px solid rgba(239,68,68,0.3)",
                                                    background: "rgba(239,68,68,0.1)", color: "#fca5a5", fontSize: 12, cursor: "pointer",
                                                }}
                                            >
                                                Hapus
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
