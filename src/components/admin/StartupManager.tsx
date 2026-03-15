"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import {
    Plus, X, Check, Pencil, Trash2, Upload, UserPlus, Users,
    AlertCircle, ImageIcon,
} from "lucide-react";
import {
    createStartup, updateStartup, deleteStartup,
    createTeamMember, deleteTeamMember,
} from "@/src/lib/admin-actions";

// ==================== TYPES ====================

interface TeamMemberData {
    id?: number;
    name: string;
    role: string;
    photo: string;
    instagramUrl: string;
}

interface StartupData {
    id: number;
    name: string;
    description: string;
    bannerImage: string;
    profileImage: string;
    programStudiId: number;
    programStudiName: string;
    membersCount: number;
    productsCount: number;
    teamMembers: TeamMemberData[];
}

interface Props {
    startups: StartupData[];
    programStudis: { value: string; label: string }[];
}

// ==================== HELPERS ====================

const MAX_FILE_SIZE = 300 * 1024;
const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".svg"];

function validateFile(file: File): string | null {
    if (file.size > MAX_FILE_SIZE) {
        return `Maaf, ukuran gambar "${file.name}" terlalu besar, maksimal 300KB`;
    }
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return `Format file "${file.name}" tidak didukung. Gunakan PNG, JPG, JPEG, atau SVG`;
    }
    return null;
}

// ==================== CONFIRMATION MODAL ====================

function ConfirmModal({ isOpen, title, message, confirmLabel, confirmColor, onConfirm, onCancel, loading }: {
    isOpen: boolean; title: string; message: string; confirmLabel: string;
    confirmColor: string; onConfirm: () => void; onCancel: () => void; loading: boolean;
}) {
    if (!isOpen) return null;
    return (
        <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999,
        }} onClick={onCancel}>
            <div onClick={(e) => e.stopPropagation()} style={{
                background: "#FFFFFF", borderRadius: 16, padding: "32px 28px",
                maxWidth: 400, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            }}>
                <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#1E1E1E" }}>{title}</h3>
                <p style={{ color: "#8F8F8F", fontSize: 14, lineHeight: 1.6, margin: "0 0 24px" }}>{message}</p>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button onClick={onCancel} disabled={loading} style={{
                        padding: "10px 20px", borderRadius: 10, border: "1px solid #C3C3C3",
                        background: "#FFFFFF", color: "#8F8F8F", fontSize: 14, fontWeight: 500, cursor: "pointer",
                    }}>Tidak</button>
                    <button onClick={onConfirm} disabled={loading} style={{
                        padding: "10px 20px", borderRadius: 10, border: "none",
                        background: loading ? `${confirmColor}80` : confirmColor,
                        color: "#fff", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                    }}>{loading ? "Memproses..." : confirmLabel}</button>
                </div>
            </div>
        </div>
    );
}

// ==================== IMAGE UPLOAD BUTTON ====================

function ImageUploadButton({ value, onChange, label }: {
    value: string; onChange: (val: string) => void; label: string;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setError("");

        const err = validateFile(file);
        if (err) { setError(err); return; }

        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (!res.ok) { setError(data.error); return; }
            onChange(data.paths[0]);
        } catch {
            setError("Gagal upload file");
        } finally {
            setUploading(false);
        }
    }, [onChange]);

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {value ? (
                    <div style={{ position: "relative" }}>
                        <img src={value} alt="" style={{
                            width: 64, height: 64, objectFit: "cover", borderRadius: 8, border: "1px solid #E5E7EB",
                        }} />
                        <button type="button" onClick={() => onChange("")} style={{
                            position: "absolute", top: -6, right: -6, width: 18, height: 18,
                            borderRadius: "50%", background: "#EF4444", border: "2px solid #fff",
                            color: "#fff", fontSize: 9, cursor: "pointer", display: "flex",
                            alignItems: "center", justifyContent: "center", padding: 0,
                        }}><X size={9} /></button>
                    </div>
                ) : (
                    <button type="button" onClick={() => inputRef.current?.click()} style={{
                        width: 64, height: 64, borderRadius: 8, border: "2px dashed #C3C3C3",
                        background: "rgba(248,250,252,0.5)", cursor: "pointer",
                        display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center",
                        gap: 2, color: "#8F8F8F", fontSize: 10,
                    }}>
                        <Upload size={16} />
                        {uploading ? "..." : label}
                    </button>
                )}
            </div>
            <input ref={inputRef} type="file" accept=".png,.jpg,.jpeg,.svg"
                onChange={handleUpload} style={{ display: "none" }} />
            {error && <p style={{ color: "#FF0000", fontSize: 11, marginTop: 4 }}>{error}</p>}
        </div>
    );
}

// ==================== MAIN COMPONENT ====================

export default function StartupManager({ startups, programStudis }: Props) {
    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Form fields
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [bannerImage, setBannerImage] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [programStudiId, setProgramStudiId] = useState("");
    const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>([
        { name: "", role: "", photo: "", instagramUrl: "" }
    ]);

    // Confirmation
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean; title: string; message: string; confirmLabel: string;
        confirmColor: string; onConfirm: () => void;
    }>({ isOpen: false, title: "", message: "", confirmLabel: "", confirmColor: "", onConfirm: () => { } });

    const inputStyle: React.CSSProperties = {
        width: "100%", padding: "10px 14px", borderRadius: 8,
        border: "1px solid #C3C3C3", background: "#FFFFFF",
        color: "#1E1E1E", fontSize: 14, outline: "none", boxSizing: "border-box",
    };

    function resetForm() {
        setName(""); setDescription(""); setBannerImage(""); setProfileImage("");
        setProgramStudiId("");
        setTeamMembers([{ name: "", role: "", photo: "", instagramUrl: "" }]);
        setError("");
    }

    function addTeamMember() {
        setTeamMembers([...teamMembers, { name: "", role: "", photo: "", instagramUrl: "" }]);
    }

    function removeTeamMember(index: number) {
        if (teamMembers.length <= 1) return;
        setTeamMembers(teamMembers.filter((_, i) => i !== index));
    }

    function updateTeamMember(index: number, field: keyof TeamMemberData, value: string) {
        setTeamMembers(prev => prev.map((m, i) =>
            i === index ? { ...m, [field]: value } : m
        ));
    }

    function startEditing(s: StartupData) {
        setEditingId(s.id);
        setShowForm(false);
        setName(s.name);
        setDescription(s.description);
        setBannerImage(s.bannerImage);
        setProfileImage(s.profileImage);
        setProgramStudiId(String(s.programStudiId));
        setTeamMembers(s.teamMembers.length > 0 ? s.teamMembers : [{ name: "", role: "", photo: "", instagramUrl: "" }]);
        setError("");
    }

    // Validate
    function validate(): string[] {
        const errors: string[] = [];
        if (!name.trim()) errors.push("Nama startup wajib diisi");
        if (!description.trim()) errors.push("Deskripsi wajib diisi");
        if (!programStudiId) errors.push("Program Studi wajib dipilih");
        if (teamMembers.length < 1) errors.push("Minimal harus ada 1 anggota tim");

        const validMembers = teamMembers.filter(m => m.name.trim() || m.role.trim());
        if (validMembers.length < 1) errors.push("Minimal harus ada 1 anggota tim yang diisi nama dan perannya");

        for (let i = 0; i < teamMembers.length; i++) {
            const m = teamMembers[i];
            if (m.name.trim() || m.role.trim()) {
                if (!m.name.trim()) errors.push(`Nama anggota tim ke-${i + 1} wajib diisi`);
                if (!m.role.trim()) errors.push(`Peran anggota tim ke-${i + 1} wajib diisi`);
            }
        }
        return errors;
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const validationErrors = validate();
        if (validationErrors.length > 0) {
            setError(validationErrors.join(". "));
            return;
        }

        setConfirmModal({
            isOpen: true,
            title: "Konfirmasi",
            message: "Apakah Anda yakin ingin menyimpan data startup ini?",
            confirmLabel: "Ya, Simpan",
            confirmColor: "#0062FF",
            onConfirm: async () => {
                setLoading(true);
                setError("");
                try {
                    const formData = new FormData();
                    formData.set("idempotencyKey", uuidv4());
                    formData.set("name", name.trim());
                    formData.set("description", description.trim());
                    formData.set("bannerImage", bannerImage);
                    formData.set("profileImage", profileImage);
                    formData.set("programStudiId", programStudiId);

                    const validMembers = teamMembers.filter(m => m.name.trim() && m.role.trim());
                    formData.set("teamMembers", JSON.stringify(validMembers));

                    let result;
                    if (editingId) {
                        result = await updateStartup(editingId, formData);
                    } else {
                        result = await createStartup(formData);
                    }

                    if (result && typeof result === "object" && "error" in result) {
                        setError((result as { error: string }).error);
                    } else {
                        resetForm();
                        setShowForm(false);
                        setEditingId(null);
                        router.refresh();
                    }
                } catch {
                    setError("Gagal menyimpan data");
                }
                setLoading(false);
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            },
        });
    }

    function handleDelete(id: number) {
        setConfirmModal({
            isOpen: true,
            title: "Hapus Startup",
            message: "Apakah Anda yakin ingin menghapus startup ini? Semua produk dan anggota tim juga akan dihapus.",
            confirmLabel: "Ya, Hapus",
            confirmColor: "#EF4444",
            onConfirm: async () => {
                setLoading(true);
                try {
                    await deleteStartup(id);
                    router.refresh();
                } catch {
                    setError("Gagal menghapus");
                }
                setLoading(false);
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            },
        });
    }

    async function handleDeleteMember(memberId: number) {
        setConfirmModal({
            isOpen: true,
            title: "Hapus Anggota",
            message: "Apakah Anda yakin ingin menghapus anggota tim ini?",
            confirmLabel: "Ya, Hapus",
            confirmColor: "#EF4444",
            onConfirm: async () => {
                setLoading(true);
                try {
                    await deleteTeamMember(memberId);
                    router.refresh();
                } catch {
                    setError("Gagal menghapus anggota");
                }
                setLoading(false);
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            },
        });
    }

    async function handleAddMember(startupId: number, memberData: TeamMemberData) {
        if (!memberData.name.trim() || !memberData.role.trim()) {
            setError("Nama dan peran anggota wajib diisi");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const formData = new FormData();
            formData.set("idempotencyKey", uuidv4());
            formData.set("name", memberData.name.trim());
            formData.set("role", memberData.role.trim());
            formData.set("photo", memberData.photo);
            formData.set("instagramUrl", memberData.instagramUrl);
            formData.set("startupId", String(startupId));
            await createTeamMember(formData);
            router.refresh();
        } catch {
            setError("Gagal menambah anggota");
        }
        setLoading(false);
    }

    const isFormOpen = showForm || editingId !== null;

    return (
        <div>
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmLabel={confirmModal.confirmLabel}
                confirmColor={confirmModal.confirmColor}
                onConfirm={confirmModal.onConfirm}
                onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                loading={loading}
            />

            {/* Add Button */}
            <button
                onClick={() => {
                    if (showForm) { setShowForm(false); resetForm(); }
                    else { setShowForm(true); setEditingId(null); resetForm(); }
                }}
                style={{
                    padding: "10px 20px", borderRadius: 10, border: "none",
                    background: showForm ? "rgba(239,68,68,0.08)" : "linear-gradient(135deg, #0062FF, #3B82F6)",
                    color: showForm ? "#EF4444" : "#fff", fontSize: 14, fontWeight: 600,
                    cursor: "pointer", marginBottom: 20, transition: "all 0.2s",
                    display: "flex", alignItems: "center", gap: 6,
                }}
            >
                {showForm ? <><X size={16} /> Batal</> : <><Plus size={16} /> Tambah Startup</>}
            </button>

            {/* Error */}
            {error && (
                <div style={{
                    padding: "10px 16px", borderRadius: 8, background: "rgba(255,0,0,0.06)",
                    border: "1px solid rgba(255,0,0,0.2)", color: "#FF0000", fontSize: 13,
                    marginBottom: 16, display: "flex", alignItems: "center", gap: 8,
                }}>
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            {/* Create/Edit Form */}
            {isFormOpen && (
                <form onSubmit={handleSubmit} style={{
                    padding: 24, borderRadius: 16, marginBottom: 24,
                    background: "#FFFFFF", border: "1px solid #E5E7EB",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1E1E1E", margin: "0 0 20px" }}>
                        {editingId ? "Edit Startup" : "Tambah Startup Baru"}
                    </h3>

                    {/* Startup Info + Images in flex layout */}
                    <div style={{ display: "flex", gap: 24 }}>
                        {/* Left: Text fields */}
                        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignContent: "start" }}>
                            <div>
                                <label style={{ display: "block", color: "#8F8F8F", fontSize: 12, marginBottom: 6, fontWeight: 500 }}>
                                    Nama Startup <span style={{ color: "#FF0000" }}>*</span>
                                </label>
                                <input value={name} placeholder="Masukan Nama StartUpmu..." onChange={(e) => setName(e.target.value)} style={inputStyle} />
                            </div>
                            <div>
                                <label style={{ display: "block", color: "#8F8F8F", fontSize: 12, marginBottom: 6, fontWeight: 500 }}>
                                    Program Studi <span style={{ color: "#FF0000" }}>*</span>
                                </label>
                                <select value={programStudiId} onChange={(e) => setProgramStudiId(e.target.value)} style={inputStyle}>
                                    <option value="">Pilih Program Studi</option>
                                    {programStudis.map(p => (
                                        <option key={p.value} value={p.value}>{p.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ gridColumn: "1 / -1" }}>
                                <label style={{ display: "block", color: "#8F8F8F", fontSize: 12, marginBottom: 6, fontWeight: 500 }}>
                                    Deskripsi <span style={{ color: "#FF0000" }}>*</span>
                                </label>
                                <textarea value={description} placeholder="Masukan Deskripsi StartUpmu..." onChange={(e) => setDescription(e.target.value)}
                                    rows={8} style={{ ...inputStyle, resize: "vertical" }} />
                            </div>
                        </div>

                        {/* Right: Image upload */}
                        <div style={{ width: 200, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                            <div>
                                <label style={{ display: "block", color: "#8F8F8F", fontSize: 12, marginBottom: 6, fontWeight: 500 }}>
                                    Profile Image
                                </label>
                                <ImageUploadButton value={profileImage} onChange={setProfileImage} label="Profil" />
                            </div>
                            <div>
                                <label style={{ display: "block", color: "#8F8F8F", fontSize: 12, marginBottom: 6, fontWeight: 500 }}>
                                    Banner Image
                                </label>
                                <ImageUploadButton value={bannerImage} onChange={setBannerImage} label="Banner" />
                            </div>
                        </div>
                    </div>

                    {/* Team Members Section */}
                    <div style={{ marginTop: 24, borderTop: "1px solid #E5E7EB", paddingTop: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <Users size={18} color="#0062FF" />
                                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#1E1E1E" }}>
                                    Anggota Tim <span style={{ color: "#FF0000" }}>*</span>
                                </h4>
                                <span style={{ fontSize: 12, color: "#8F8F8F" }}>(minimal 1 anggota)</span>
                            </div>
                            <button type="button" onClick={addTeamMember} style={{
                                padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(0,98,255,0.2)",
                                background: "rgba(0,98,255,0.06)", color: "#0062FF", fontSize: 12,
                                fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                            }}>
                                <UserPlus size={14} /> Tambah Anggota
                            </button>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {teamMembers.map((member, index) => (
                                <div key={index} style={{
                                    display: "flex", gap: 12, alignItems: "flex-start",
                                    padding: 12, borderRadius: 10, background: "#F8FAFC", border: "1px solid #E5E7EB",
                                }}>
                                    <ImageUploadButton
                                        value={member.photo}
                                        onChange={(val) => updateTeamMember(index, "photo", val)}
                                        label="Foto"
                                    />
                                    <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                        <div>
                                            <label style={{ display: "block", color: "#8F8F8F", fontSize: 11, marginBottom: 4 }}>
                                                Nama <span style={{ color: "#FF0000" }}>*</span>
                                            </label>
                                            <input value={member.name}
                                                placeholder="Masukan Nama Anggota Timmu..."
                                                onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                                                style={{ ...inputStyle, padding: "8px 12px", fontSize: 13 }} />
                                        </div>
                                        <div>
                                            <label style={{ display: "block", color: "#8F8F8F", fontSize: 11, marginBottom: 4 }}>
                                                Peran Anggota <span style={{ color: "#FF0000" }}>*</span>
                                            </label>
                                            <select
                                                value={member.role}
                                                onChange={(e) => updateTeamMember(index, "role", e.target.value)}
                                                style={{ ...inputStyle, padding: "8px 12px", fontSize: 13 }}
                                            >
                                                <option value="">Pilih Peran</option>
                                                <option value="Ketua">Ketua</option>
                                                <option value="Wakil">Wakil</option>
                                                <option value="Member">Member</option>
                                            </select>
                                        </div>
                                        <div style={{ gridColumn: "1 / -1" }}>
                                            <label style={{ display: "block", color: "#8F8F8F", fontSize: 11, marginBottom: 4 }}>
                                                Instagram URL
                                            </label>
                                            <input value={member.instagramUrl}
                                                onChange={(e) => updateTeamMember(index, "instagramUrl", e.target.value)}
                                                placeholder="https://instagram.com/username"
                                                style={{ ...inputStyle, padding: "8px 12px", fontSize: 13 }} />
                                        </div>
                                    </div>
                                    {teamMembers.length > 1 && (
                                        <button type="button" onClick={() => removeTeamMember(index)} style={{
                                            padding: 6, borderRadius: 6, border: "1px solid rgba(239,68,68,0.2)",
                                            background: "rgba(239,68,68,0.06)", color: "#EF4444",
                                            cursor: "pointer", flexShrink: 0,
                                        }}>
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
                        <button type="submit" disabled={loading} style={{
                            padding: "12px 24px", borderRadius: 10, border: "none",
                            background: loading ? "rgba(0,98,255,0.5)" : "linear-gradient(135deg, #0062FF, #3B82F6)",
                            color: "#fff", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                            display: "flex", alignItems: "center", gap: 6,
                        }}>
                            <Check size={16} /> {loading ? "Menyimpan..." : "Simpan Startup"}
                        </button>
                        {editingId && (
                            <button type="button" onClick={() => { setEditingId(null); resetForm(); }} style={{
                                padding: "12px 24px", borderRadius: 10, border: "1px solid #C3C3C3",
                                background: "#FFFFFF", color: "#8F8F8F", fontSize: 14, fontWeight: 500, cursor: "pointer",
                            }}>
                                Batal
                            </button>
                        )}
                    </div>
                </form>
            )}

            {/* Startup Table & Details */}
            <div style={{
                borderRadius: 16, overflow: "hidden", background: "#FFFFFF",
                border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}>
                <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                            <th style={{ textAlign: "left", padding: "14px 20px", fontSize: 12, color: "#8F8F8F", fontWeight: 600, width: 40 }}>#</th>
                            <th style={{ textAlign: "left", padding: "14px 16px", fontSize: 12, color: "#8F8F8F", fontWeight: 600, minWidth: 140 }}>Startup</th>
                            <th style={{ textAlign: "left", padding: "14px 16px", fontSize: 12, color: "#8F8F8F", fontWeight: 600, maxWidth: 200 }}>Deskripsi</th>
                            <th style={{ textAlign: "left", padding: "14px 16px", fontSize: 12, color: "#8F8F8F", fontWeight: 600 }}>Program Studi</th>
                            <th style={{ textAlign: "left", padding: "14px 16px", fontSize: 12, color: "#8F8F8F", fontWeight: 600, minWidth: 180 }}>Anggota Tim</th>
                            <th style={{ textAlign: "left", padding: "14px 16px", fontSize: 12, color: "#8F8F8F", fontWeight: 600, width: 60 }}>Produk</th>
                            <th style={{ textAlign: "center", padding: "14px 20px", fontSize: 12, color: "#8F8F8F", fontWeight: 600, width: 130 }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {startups.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#8F8F8F", fontSize: 14 }}>
                                    Belum ada data startup
                                </td>
                            </tr>
                        ) : startups.map((s, i) => (
                            <tr key={s.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                                <td style={{ padding: "12px 20px", fontSize: 13, color: "#8F8F8F" }}>{i + 1}</td>
                                <td style={{ padding: "12px 16px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        {s.profileImage ? (
                                            <img src={s.profileImage} alt="" style={{
                                                width: 36, height: 36, borderRadius: 8, objectFit: "cover",
                                                border: "1px solid #E5E7EB",
                                            }} />
                                        ) : (
                                            <div style={{
                                                width: 36, height: 36, borderRadius: 8, background: "#F3F4F6",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                            }}>
                                                <ImageIcon size={16} color="#8F8F8F" />
                                            </div>
                                        )}
                                        <span style={{ fontSize: 14, fontWeight: 500, color: "#1E1E1E" }}>{s.name}</span>
                                    </div>
                                </td>
                                {/* Deskripsi - max 10 kata */}
                                <td style={{ padding: "12px 16px", maxWidth: 200 }}>
                                    <span style={{
                                        fontSize: 13, color: "#6B7280", lineHeight: 1.5,
                                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const,
                                        overflow: "hidden", textOverflow: "ellipsis",
                                    }}>
                                        {s.description.split(/\s+/).slice(0, 10).join(" ")}
                                        {s.description.split(/\s+/).length > 10 ? "..." : ""}
                                    </span>
                                </td>
                                <td style={{ padding: "12px 16px", fontSize: 14, color: "#1E1E1E" }}>{s.programStudiName}</td>
                                {/* Anggota Tim - tampilkan nama + role */}
                                <td style={{ padding: "12px 16px" }}>
                                    {s.teamMembers.length === 0 ? (
                                        <span style={{ fontSize: 13, color: "#8F8F8F", fontStyle: "italic" }}>Belum ada</span>
                                    ) : (
                                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                            {s.teamMembers.map((m, mi) => (
                                                <div key={mi} style={{
                                                    display: "inline-flex", alignItems: "center", gap: 6,
                                                }}>
                                                    <span style={{
                                                        fontSize: 13, fontWeight: 500, color: "#1E1E1E",
                                                        whiteSpace: "nowrap",
                                                    }}>
                                                        {m.name}
                                                    </span>
                                                    <span style={{
                                                        fontSize: 10, fontWeight: 600, color: "#6B7280",
                                                        background: "#F3F4F6", borderRadius: 4,
                                                        padding: "2px 6px", whiteSpace: "nowrap",
                                                    }}>
                                                        {m.role}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: "12px 16px", fontSize: 14, color: "#1E1E1E" }}>{s.productsCount}</td>
                                <td style={{ padding: "12px 20px", textAlign: "center" }}>
                                    <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                                        <button onClick={() => startEditing(s)} style={{
                                            padding: "6px 10px", borderRadius: 6,
                                            border: "1px solid rgba(0,98,255,0.2)",
                                            background: "rgba(0,98,255,0.06)", color: "#0062FF",
                                            fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                                        }}>
                                            <Pencil size={12} /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(s.id)} style={{
                                            padding: "6px 10px", borderRadius: 6,
                                            border: "1px solid rgba(239,68,68,0.2)",
                                            background: "rgba(239,68,68,0.06)", color: "#EF4444",
                                            fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                                        }}>
                                            <Trash2 size={12} /> Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    );
}
