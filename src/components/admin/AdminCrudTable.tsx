"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, X, Check, Upload, AlertCircle, ImageIcon, ExternalLink } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import {
    createProduct, updateProduct, deleteProduct,
    createStartup, updateStartup, deleteStartup,
    createCategory, updateCategory, deleteCategory,
    createProgramStudi, updateProgramStudi, deleteProgramStudi,
    createUser, deleteUser,
    createTeamMember, deleteTeamMember,
    createKategoriBerita, updateKategoriBerita, deleteKategoriBerita,
    createBerita, updateBerita, deleteBerita,
} from "@/src/lib/admin-actions";

// ==================== TYPES ====================

interface FormField {
    name: string;
    label: string;
    type: "text" | "textarea" | "number" | "select" | "email" | "password" | "url" | "file" | "phone" | "rupiah";
    required?: boolean;
    options?: { value: string; label: string }[];
    multiple?: boolean; // for file upload
    accept?: string;
    minLength?: number;
    minWords?: number;
    min?: number;
}

interface Props {
    type: "product" | "startup" | "category" | "program-studi" | "user" | "team-member" | "kategori-berita" | "berita";
    data: Record<string, unknown>[];
    columns: string[];
    columnLabels: string[];
    formFields: FormField[];
    userRole?: string;
    parentId?: number;
    imageColumns?: string[]; // columns that contain image paths
}

const deleteActions: Record<string, (id: number) => Promise<unknown>> = {
    product: deleteProduct,
    startup: deleteStartup,
    category: deleteCategory,
    "program-studi": deleteProgramStudi,
    user: deleteUser,
    "team-member": deleteTeamMember,
    "kategori-berita": deleteKategoriBerita,
    berita: deleteBerita,
};

const createActions: Record<string, (formData: FormData) => Promise<unknown>> = {
    product: createProduct,
    startup: createStartup,
    category: createCategory,
    "program-studi": createProgramStudi,
    user: createUser,
    "team-member": createTeamMember,
    "kategori-berita": createKategoriBerita,
    berita: createBerita,
};

const updateActions: Record<string, (id: number, formData: FormData) => Promise<unknown>> = {
    product: updateProduct,
    startup: updateStartup,
    category: updateCategory,
    "program-studi": updateProgramStudi,
    "kategori-berita": updateKategoriBerita,
    berita: updateBerita,
};

// ==================== HELPERS ====================

function formatRupiah(value: string): string {
    const num = value.replace(/\D/g, "");
    if (!num) return "";
    return "Rp " + num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatPhoneNumber(value: string): string {
    // Remove non-digits
    let digits = value.replace(/\D/g, "");
    // If starts with 0, replace with 62
    if (digits.startsWith("0")) {
        digits = "62" + digits.slice(1);
    }
    // If doesn't start with 62, prepend
    if (!digits.startsWith("62") && digits.length > 0) {
        digits = "62" + digits;
    }
    return digits ? "+" + digits : "";
}

const DEFAULT_MAX_FILE_SIZE = 300 * 1024;
const PROFILE_MAX_FILE_SIZE = 200 * 1024;
const PRODUCT_EXTENSIONS = [".png", ".jpg", ".jpeg", ".svg"];
const PROFILE_EXTENSIONS = [".png", ".jpg", ".jpeg"];

function getFileConfig(field: FormField) {
    if (field.name === "image" || field.name === "gambar") {
        return {
            maxSize: 2 * 1024 * 1024, // updated to 2MB as per PRD for Berita
            allowedExtensions: PRODUCT_EXTENSIONS.includes(".webp") ? PRODUCT_EXTENSIONS : [...PRODUCT_EXTENSIONS, ".webp"],
            helperText: 'Format: JPG, PNG, WEBP, SVG. Max 2MB.',
        };
    }

    if (field.name === "bannerImage") {
        return {
            maxSize: DEFAULT_MAX_FILE_SIZE,
            allowedExtensions: PRODUCT_EXTENSIONS,
            helperText: "Format: JPG, PNG. Ukuran: 1440x250px. Max 300KB.",
        };
    }

    if (field.name === "photo" || field.name === "profileImage" || field.name === "icon") {
        return {
            maxSize: PROFILE_MAX_FILE_SIZE,
            allowedExtensions: PROFILE_EXTENSIONS,
            helperText: "Format: JPG, PNG. Ukuran: 1024x1024px (1:1). Max 200KB.",
        };
    }

    return {
        maxSize: DEFAULT_MAX_FILE_SIZE,
        allowedExtensions: PRODUCT_EXTENSIONS,
        helperText: "PNG, JPG, JPEG, SVG (Maks. 300KB)",
    };
}

function validateFile(file: File, field: FormField): string | null {
    const { maxSize, allowedExtensions } = getFileConfig(field);
    if (file.size > maxSize) {
        const kb = Math.round(maxSize / 1024);
        return `Ukuran gambar "${file.name}" terlalu besar. Maksimal ${kb}KB`;
    }
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!allowedExtensions.includes(ext)) {
        return `Format file "${file.name}" tidak didukung. Gunakan ${allowedExtensions.join(", ").toUpperCase()}`;
    }
    return null;
}

// ==================== CONFIRMATION MODAL ====================

function ConfirmationModal({
    isOpen,
    onConfirm,
    onCancel,
    loading,
}: {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    loading: boolean;
}) {
    if (!isOpen) return null;
    return (
        <div
            style={{
                position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 9999,
            }}
            onClick={onCancel}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "#FFFFFF", borderRadius: 16, padding: "32px 28px",
                    maxWidth: 400, width: "90%",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                    animation: "fadeIn 0.2s ease-out",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: "rgba(0,98,255,0.08)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <AlertCircle size={20} color="#0062FF" />
                    </div>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1E1E1E" }}>Konfirmasi</h3>
                </div>
                <p style={{ color: "#8F8F8F", fontSize: 14, lineHeight: 1.6, margin: "0 0 24px" }}>
                    Apakah Anda yakin ingin menyimpan data ini?
                </p>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        style={{
                            padding: "10px 20px", borderRadius: 10,
                            border: "1px solid #C3C3C3", background: "#FFFFFF",
                            color: "#8F8F8F", fontSize: 14, fontWeight: 500, cursor: "pointer",
                        }}
                    >
                        Tidak
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        style={{
                            padding: "10px 20px", borderRadius: 10, border: "none",
                            background: loading ? "rgba(0,98,255,0.5)" : "linear-gradient(135deg, #0062FF, #3B82F6)",
                            color: "#fff", fontSize: 14, fontWeight: 600,
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                    >
                        {loading ? "Menyimpan..." : "Ya, Simpan"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ==================== DELETE CONFIRMATION MODAL ====================

function DeleteConfirmationModal({
    isOpen,
    onConfirm,
    onCancel,
    loading,
}: {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    loading: boolean;
}) {
    if (!isOpen) return null;
    return (
        <div
            style={{
                position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 9999,
            }}
            onClick={onCancel}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "#FFFFFF", borderRadius: 16, padding: "32px 28px",
                    maxWidth: 400, width: "90%",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: "rgba(239,68,68,0.08)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <Trash2 size={20} color="#EF4444" />
                    </div>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1E1E1E" }}>Hapus Data</h3>
                </div>
                <p style={{ color: "#8F8F8F", fontSize: 14, lineHeight: 1.6, margin: "0 0 24px" }}>
                    Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
                </p>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        style={{
                            padding: "10px 20px", borderRadius: 10,
                            border: "1px solid #C3C3C3", background: "#FFFFFF",
                            color: "#8F8F8F", fontSize: 14, fontWeight: 500, cursor: "pointer",
                        }}
                    >
                        Tidak
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        style={{
                            padding: "10px 20px", borderRadius: 10, border: "none",
                            background: loading ? "rgba(239,68,68,0.5)" : "#EF4444",
                            color: "#fff", fontSize: 14, fontWeight: 600,
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                    >
                        {loading ? "Menghapus..." : "Ya, Hapus"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ==================== FILE UPLOAD PREVIEW ====================

function FileUploadField({
    field,
    value,
    onChange,
    error,
}: {
    field: FormField;
    value: string | string[];
    onChange: (val: string | string[]) => void;
    error?: string;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previews, setPreviews] = useState<string[]>(
        Array.isArray(value) ? value.filter(Boolean) : value ? [value] : []
    );
    const [uploadError, setUploadError] = useState("");
    const [uploading, setUploading] = useState(false);

    const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setUploadError("");

        // Validate files
        for (const file of Array.from(files)) {
            const err = validateFile(file, field);
            if (err) {
                setUploadError(err);
                return;
            }
        }

        setUploading(true);
        try {
            const uploadFormData = new FormData();
            for (const file of Array.from(files)) {
                uploadFormData.append("file", file);
            }

            const res = await fetch("/api/upload", { method: "POST", body: uploadFormData });
            const data = await res.json();
            if (!res.ok) {
                setUploadError(data.error || "Gagal upload file");
                return;
            }

            const paths: string[] = data.paths;
            if (field.multiple) {
                const newPreviews = [...previews, ...paths];
                setPreviews(newPreviews);
                onChange(newPreviews);
            } else {
                setPreviews(paths.slice(0, 1));
                onChange(paths[0] || "");
            }
        } catch {
            setUploadError("Gagal upload file, coba lagi");
        } finally {
            setUploading(false);
        }
    }, [field, onChange, previews]);

    const removePreview = (index: number) => {
        const updated = previews.filter((_, i) => i !== index);
        setPreviews(updated);
        onChange(field.multiple ? updated : (updated[0] || ""));
    };

    return (
        <div>
            <div style={{
                display: "flex", flexDirection: "column", gap: 10,
            }}>
                {/* Upload area */}
                <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        border: "2px dashed #C3C3C3", borderRadius: 12,
                        padding: "20px 16px", textAlign: "center", cursor: "pointer",
                        background: "rgba(248,250,252,0.5)",
                        transition: "all 0.2s",
                    }}
                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "#0062FF"; }}
                    onDragLeave={(e) => { e.currentTarget.style.borderColor = "#C3C3C3"; }}
                    onDrop={async (e) => {
                        e.preventDefault();
                        e.currentTarget.style.borderColor = "#C3C3C3";
                        const dt = e.dataTransfer;
                        if (dt.files && dt.files.length > 0 && fileInputRef.current) {
                            const dataTransfer = new DataTransfer();
                            for (const f of Array.from(dt.files)) dataTransfer.items.add(f);
                            fileInputRef.current.files = dataTransfer.files;
                            fileInputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
                        }
                    }}
                >
                    <Upload size={24} color="#8F8F8F" style={{ margin: "0 auto 8px" }} />
                    <p style={{ color: "#8F8F8F", fontSize: 13, margin: 0 }}>
                        {uploading ? "Mengupload..." : "Klik atau seret gambar ke sini"}
                    </p>
                    <p style={{ color: "#C3C3C3", fontSize: 11, margin: "4px 0 0" }}>
                        {getFileConfig(field).helperText}
                    </p>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml"
                    multiple={field.multiple}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />

                {/* Previews */}
                {previews.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {previews.map((src, i) => (
                            <div key={i} style={{ position: "relative" }}>
                                <img
                                    src={src}
                                    alt={`Preview ${i + 1}`}
                                    style={{
                                        width: 80, height: 80, objectFit: "cover",
                                        borderRadius: 8, border: "1px solid #E5E7EB",
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => removePreview(i)}
                                    style={{
                                        position: "absolute", top: -6, right: -6,
                                        width: 20, height: 20, borderRadius: "50%",
                                        background: "#EF4444", border: "2px solid #fff",
                                        color: "#fff", fontSize: 10, cursor: "pointer",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        padding: 0,
                                    }}
                                >
                                    <X size={10} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {(uploadError || error) && (
                <p style={{ color: "#FF0000", fontSize: 12, marginTop: 6 }}>
                    {uploadError || error}
                </p>
            )}
        </div>
    );
}

// ==================== MAIN COMPONENT ====================

export default function AdminCrudTable({ type, data, columns, columnLabels, formFields, userRole, parentId, imageColumns = [] }: Props) {
    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    // Controlled form values (persistence)
    const [formValues, setFormValues] = useState<Record<string, string | string[]>>({});
    const [editValues, setEditValues] = useState<Record<string, string | string[]>>({});

    // Confirmation modal
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null);

    // Delete confirmation
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

    const canCreate = type === "user" ? userRole === "ADMINISTRATOR" : true;
    const canEdit = type in updateActions;

    // Field value getter/setter
    const getFieldValue = (fieldName: string, isEdit: boolean) => {
        return isEdit ? (editValues[fieldName] ?? "") : (formValues[fieldName] ?? "");
    };

    const setFieldValue = (fieldName: string, value: string | string[], isEdit: boolean) => {
        if (isEdit) {
            setEditValues((prev) => ({ ...prev, [fieldName]: value }));
        } else {
            setFormValues((prev) => ({ ...prev, [fieldName]: value }));
        }
    };

    const clearFieldError = (fieldName: string) => {
        setFieldErrors((prev) => {
            if (!prev[fieldName]) return prev;
            const { [fieldName]: _, ...rest } = prev;
            return rest;
        });
    };

    function getPlaceholder(field: FormField): string {
        if (field.name === "ecommerceUrl") return "https://tokomu.com/produk...";
        if (field.type === "email") return "Masukan Email..";
        if (field.type === "password") return "Masukan Password..";
        if (field.type === "number") return "Masukan angka..";
        if (field.type === "url") return "Masukan URL..";
        if (field.type === "textarea") return `Masukan ${field.label.toLowerCase()}..`;
        if (field.type === "rupiah") return "Rp 0";
        if (field.type === "phone") return "+62...";
        return `Masukan ${field.label}..`;
    }

    // Client-side validation
    function validateForm(values: Record<string, string | string[]>): Record<string, string> {
        const errors: Record<string, string> = {};

        for (const field of formFields) {
            const val = values[field.name];
            const strVal = Array.isArray(val) ? val.join(",") : (val || "").toString().trim();

            if (field.required && !strVal) {
                errors[field.name] = `${field.label} wajib diisi`;
                continue;
            }

            if (!strVal) continue;

            if (field.minLength && strVal.length < field.minLength) {
                errors[field.name] = `${field.label} minimal ${field.minLength} karakter`;
            }

            if (field.minWords) {
                const wordCount = strVal.split(/\s+/).filter(Boolean).length;
                if (wordCount < field.minWords) {
                    errors[field.name] = `${field.label} minimal ${field.minWords} kata`;
                }
            }

            if (field.min !== undefined && field.type === "number") {
                const num = parseInt(strVal) || 0;
                if (num < field.min) {
                    errors[field.name] = `${field.label} minimal ${field.min}`;
                }
            }

            if (field.type === "rupiah") {
                const num = parseInt(strVal.replace(/\D/g, "")) || 0;
                if (field.required && num <= 0) {
                    errors[field.name] = `${field.label} harus lebih dari 0`;
                }
            }

            if (field.type === "url" && strVal) {
                try {
                    new URL(strVal);
                } catch {
                    errors[field.name] = "Link harus berupa URL yang valid (contoh: https://...)";
                }
            }

            if (field.type === "email" && strVal) {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strVal)) {
                    errors[field.name] = "Format email tidak valid";
                }
            }
        }

        return errors;
    }

    // Handle create
    function handleCreateSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Validate
        const errors = validateForm(formValues);
        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) return;

        // Show confirmation modal
        setShowConfirm(true);
        setPendingAction(() => async () => {
            setLoading(true);
            setError("");
            try {
                const formData = new FormData();
                formData.set("idempotencyKey", uuidv4());
                if (parentId) formData.set("startupId", String(parentId));

                for (const field of formFields) {
                    const val = formValues[field.name] || "";
                    if (Array.isArray(val)) {
                        formData.set(field.name, val.join(","));
                    } else if (field.type === "rupiah") {
                        formData.set(field.name, String(val));
                    } else {
                        formData.set(field.name, String(val));
                    }
                }

                const result = await createActions[type](formData);
                if (result && typeof result === "object" && "error" in result) {
                    setError((result as { error: string }).error);
                } else {
                    setShowForm(false);
                    setFormValues({});
                    setFieldErrors({});
                    router.refresh();
                }
            } catch (err) {
                console.error("Gagal menyimpan data", err);
                setError("Maaf, terjadi masalah pada server saat menyimpan data. Silakan cek kembali isian Anda atau coba beberapa saat lagi.");
            }
            setLoading(false);
        });
    }

    // Handle update
    function handleUpdateSubmit(id: number, e: React.FormEvent) {
        e.preventDefault();

        const errors = validateForm(editValues);
        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setShowConfirm(true);
        setPendingAction(() => async () => {
            setLoading(true);
            setError("");
            try {
                const formData = new FormData();
                formData.set("idempotencyKey", uuidv4());

                for (const field of formFields) {
                    const val = editValues[field.name] || "";
                    if (Array.isArray(val)) {
                        formData.set(field.name, val.join(","));
                    } else {
                        formData.set(field.name, String(val));
                    }
                }

                const result = await updateActions[type](id, formData);
                if (result && typeof result === "object" && "error" in result) {
                    setError((result as { error: string }).error);
                } else {
                    setEditingId(null);
                    setEditValues({});
                    setFieldErrors({});
                    router.refresh();
                }
            } catch (err) {
                console.error("Gagal mengupdate data", err);
                setError("Maaf, terjadi masalah pada server saat memperbarui data. Silakan cek kembali isian Anda atau coba beberapa saat lagi.");
            }
            setLoading(false);
        });
    }

    // Handle delete
    function handleDeleteClick(id: number) {
        setPendingDeleteId(id);
        setShowDeleteConfirm(true);
    }

    async function handleDeleteConfirm() {
        if (pendingDeleteId === null) return;
        setLoading(true);
        try {
            await deleteActions[type](pendingDeleteId);
            router.refresh();
        } catch {
            setError("Gagal menghapus data");
        }
        setLoading(false);
        setShowDeleteConfirm(false);
        setPendingDeleteId(null);
    }

    // Start editing - populate edit values
    function startEditing(row: Record<string, unknown>) {
        const values: Record<string, string | string[]> = {};
        for (const field of formFields) {
            const rawVal = row[field.name];
            if (field.type === "rupiah" && rawVal !== undefined) {
                values[field.name] = formatRupiah(String(rawVal));
            } else if (field.type === "file") {
                const strVal = String(rawVal ?? "");
                values[field.name] = strVal.includes(",") ? strVal.split(",") : strVal;
            } else {
                values[field.name] = String(rawVal ?? "");
            }
        }
        setEditValues(values);
        setEditingId(row.id as number);
        setShowForm(false);
        setError("");
        setFieldErrors({});
    }

    // Input style
    const inputStyle: React.CSSProperties = {
        width: "100%", padding: "10px 14px", borderRadius: 8,
        border: "1px solid #C3C3C3", background: "#FFFFFF",
        color: "#1E1E1E", fontSize: 14, outline: "none", boxSizing: "border-box",
    };

    const errorInputStyle: React.CSSProperties = {
        ...inputStyle,
        border: "1px solid #FF0000",
    };

    // Render form fields
    const renderFormFields = (isEdit: boolean) => {
        // Separate file fields for flex layout
        const textFields = formFields.filter((f) => f.type !== "file");
        const fileFields = formFields.filter((f) => f.type === "file");

        return (
            <div style={{ display: "flex", gap: 24, width: "100%" }}>
                {/* Left side - Text/Data fields */}
                <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignContent: "start" }}>
                    {textFields.map((field) => {
                        const fieldValue = getFieldValue(field.name, isEdit);
                        const strVal = Array.isArray(fieldValue) ? fieldValue.join(",") : String(fieldValue);
                        const fieldError = fieldErrors[field.name];

                        return (
                            <div key={field.name} style={{ gridColumn: field.type === "textarea" ? "1 / -1" : "auto" }}>
                                <label style={{ display: "block", color: "#8F8F8F", fontSize: 12, marginBottom: 6, fontWeight: 500 }}>
                                    {field.label} {field.required && <span style={{ color: "#FF0000" }}>*</span>}
                                </label>
                                {field.type === "textarea" ? (
                                    <textarea
                                        rows={3}
                                        value={strVal}
                                        onChange={(e) => {
                                            clearFieldError(field.name);
                                            setFieldValue(field.name, e.target.value, isEdit);
                                        }}
                                        style={{ ...(fieldError ? errorInputStyle : inputStyle), resize: "vertical" }}
                                        placeholder={getPlaceholder(field)}
                                    />
                                ) : field.type === "select" ? (
                                    <select
                                        value={strVal}
                                        onChange={(e) => {
                                            clearFieldError(field.name);
                                            setFieldValue(field.name, e.target.value, isEdit);
                                        }}
                                        style={fieldError ? errorInputStyle : inputStyle}
                                    >
                                        <option value="">Pilih {field.label}</option>
                                        {field.options?.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                ) : field.type === "phone" ? (
                                    <input
                                        type="text"
                                        value={strVal}
                                        onChange={(e) => {
                                            clearFieldError(field.name);
                                            const formatted = formatPhoneNumber(e.target.value);
                                            setFieldValue(field.name, formatted, isEdit);
                                        }}
                                        onKeyDown={(e) => {
                                            // Block letters
                                            if (/^[a-zA-Z]$/.test(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                        placeholder={getPlaceholder(field)}
                                        style={fieldError ? errorInputStyle : inputStyle}
                                    />
                                ) : field.type === "rupiah" ? (
                                    <input
                                        type="text"
                                        value={strVal}
                                        onChange={(e) => {
                                            clearFieldError(field.name);
                                            const formatted = formatRupiah(e.target.value);
                                            setFieldValue(field.name, formatted, isEdit);
                                        }}
                                        placeholder={getPlaceholder(field)}
                                        style={fieldError ? errorInputStyle : inputStyle}
                                    />
                                ) : (
                                    <input
                                        type={field.type === "url" ? "url" : field.type}
                                        value={strVal}
                                        onChange={(e) => {
                                            clearFieldError(field.name);
                                            setFieldValue(field.name, e.target.value, isEdit);
                                        }}
                                        placeholder={getPlaceholder(field)}
                                        style={fieldError ? errorInputStyle : inputStyle}
                                    />
                                )}
                                {fieldError && (
                                    <p style={{ color: "#FF0000", fontSize: 12, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                                        <AlertCircle size={12} /> {fieldError}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Right side - File upload fields */}
                {fileFields.length > 0 && (
                    <div style={{ width: 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                        {fileFields.map((field) => {
                            const fieldValue = getFieldValue(field.name, isEdit);
                            return (
                                <div key={field.name}>
                                    <label style={{ display: "block", color: "#8F8F8F", fontSize: 12, marginBottom: 6, fontWeight: 500 }}>
                                        {field.label} {field.required && <span style={{ color: "#FF0000" }}>*</span>}
                                    </label>
                                    <FileUploadField
                                        field={field}
                                        value={fieldValue}
                                        onChange={(val) => setFieldValue(field.name, val, isEdit)}
                                        error={fieldErrors[field.name]}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    // Check if a column value is an image path
    const isImagePath = (col: string, value: unknown): boolean => {
        if (imageColumns.includes(col)) return true;
        const strVal = String(value ?? "");
        return /\.(png|jpg|jpeg|svg|webp)$/i.test(strVal) || strVal.startsWith("/uploads/");
    };

    const getFirstImageAndCount = (raw: unknown): { first?: string; extraCount: number } => {
        if (!raw) return { first: undefined, extraCount: 0 };

        if (Array.isArray(raw)) {
            const filtered = raw.filter(Boolean);
            if (filtered.length === 0) return { first: undefined, extraCount: 0 };
            return { first: String(filtered[0]), extraCount: filtered.length - 1 };
        }

        const str = String(raw);
        // Try JSON parse
        try {
            const parsed = JSON.parse(str);
            if (Array.isArray(parsed)) {
                const filtered = parsed.filter(Boolean);
                if (filtered.length === 0) return { first: undefined, extraCount: 0 };
                return { first: String(filtered[0]), extraCount: filtered.length - 1 };
            }
        } catch {
            // not JSON, fall through
        }

        const parts = str.split(",").map((s) => s.trim()).filter(Boolean);
        if (parts.length === 0) return { first: undefined, extraCount: 0 };
        return { first: parts[0], extraCount: parts.length - 1 };
    };

    return (
        <div>
            {/* Confirmation Modals */}
            <ConfirmationModal
                isOpen={showConfirm}
                loading={loading}
                onConfirm={() => {
                    if (pendingAction) {
                        pendingAction().then(() => {
                            setShowConfirm(false);
                            setPendingAction(null);
                        });
                    }
                }}
                onCancel={() => {
                    setShowConfirm(false);
                    setPendingAction(null);
                }}
            />
            <DeleteConfirmationModal
                isOpen={showDeleteConfirm}
                loading={loading}
                onConfirm={handleDeleteConfirm}
                onCancel={() => {
                    setShowDeleteConfirm(false);
                    setPendingDeleteId(null);
                }}
            />

            {/* Add Button */}
            {canCreate && (
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditingId(null);
                        if (!showForm) {
                            // Don't reset formValues when opening (persistence)
                            setFieldErrors({});
                            setError("");
                        }
                    }}
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
                <div style={{
                    padding: "10px 16px", borderRadius: 8,
                    background: "rgba(255,0,0,0.06)", border: "1px solid rgba(255,0,0,0.2)",
                    color: "#FF0000", fontSize: 13, marginBottom: 16,
                    display: "flex", alignItems: "center", gap: 8,
                }}>
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            {/* Create Form */}
            {showForm && (
                <form
                    onSubmit={handleCreateSubmit}
                    style={{
                        padding: 24, borderRadius: 16, marginBottom: 24,
                        background: "#FFFFFF", border: "1px solid #E5E7EB",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}
                >
                    {renderFormFields(false)}
                    <div style={{ marginTop: 16 }}>
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

            {/* Data Table - responsive container */}
            <div
                style={{
                    borderRadius: 16,
                    overflow: "hidden",
                    background: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
            >
                {/* Desktop / Tablet table */}
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                            <th style={{ textAlign: "left", padding: "14px 20px", fontSize: 12, color: "#8F8F8F", fontWeight: 600 }}>#</th>
                            {columnLabels.map((label) => (
                                <th key={label} style={{ textAlign: "left", padding: "14px 16px", fontSize: 12, color: "#8F8F8F", fontWeight: 600 }}>{label}</th>
                            ))}
                            <th style={{ textAlign: "center", padding: "14px 20px", fontSize: 12, color: "#8F8F8F", fontWeight: 600 }}>Aksi</th>
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
                                                onSubmit={(e) => handleUpdateSubmit(row.id as number, e)}
                                            >
                                                {renderFormFields(true)}
                                                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
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
                                                        onClick={() => { setEditingId(null); setEditValues({}); setFieldErrors({}); }}
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
                                                {isImagePath(col, row[col]) && String(row[col] ?? "") ? (() => {
                                                    const { first, extraCount } = getFirstImageAndCount(row[col]);
                                                    if (!first) {
                                                        return (
                                                            <span>{String(row[col] ?? "-")}</span>
                                                        );
                                                    }
                                                    return (
                                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                            <img
                                                                src={first}
                                                                alt=""
                                                                style={{
                                                                    width: 50,
                                                                    height: 50,
                                                                    objectFit: "cover",
                                                                    borderRadius: 8,
                                                                    border: "1px solid #E5E7EB",
                                                                }}
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).style.display = "none";
                                                                }}
                                                            />
                                                            {extraCount > 0 && (
                                                                <span style={{ fontSize: 11, color: "#6B7280" }}>
                                                                    +{extraCount}
                                                                </span>
                                                            )}
                                                        </div>
                                                    );
                                                })() : col === "ecommerceUrl" && row[col] ? (
                                                    <a
                                                        href={String(row[col])}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            display: "inline-flex",
                                                            alignItems: "center",
                                                            gap: 4,
                                                            fontSize: 13,
                                                            color: "#0062FF",
                                                            textDecoration: "none",
                                                        }}
                                                    >
                                                        <ExternalLink size={14} />
                                                        <span
                                                            style={{
                                                                maxWidth: 160,
                                                                whiteSpace: "nowrap",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                            }}
                                                        >
                                                            {String(row[col])}
                                                        </span>
                                                    </a>
                                                ) : (
                                                    <span>
                                                        {col === "price"
                                                            ? formatRupiah(String(row[col] ?? "0"))
                                                            : String(row[col] ?? "-")}
                                                    </span>
                                                )}
                                            </td>
                                        ))}
                                        <td style={{ padding: "12px 20px", textAlign: "right" }}>
                                            <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                                                {canEdit && (
                                                    <button
                                                        onClick={() => startEditing(row)}
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
                                                        onClick={() => handleDeleteClick(row.id as number)}
                                                        style={{
                                                            padding: "6px 10px", borderRadius: 6,
                                                            border: "1px solid rgba(239,68,68,0.2)",
                                                            background: "rgba(239,68,68,0.06)", color: "#EF4444",
                                                            fontSize: 12, cursor: "pointer",
                                                            display: "flex", alignItems: "start", gap: 4,
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
        </div>
    );
}
