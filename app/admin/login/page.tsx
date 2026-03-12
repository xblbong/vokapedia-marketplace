"use client";

import { useState } from "react";
import { loginAdmin } from "@/src/lib/auth";

export default function AdminLoginPage() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError("");
        const result = await loginAdmin(formData);
        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'DM Sans', sans-serif",
        }}>
            <div style={{
                width: "100%",
                maxWidth: 420,
                padding: "40px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
            }}>
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: 14,
                        background: "linear-gradient(135deg, #0062FF, #3B82F6)",
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        marginBottom: 16, boxShadow: "0 8px 20px rgba(0,98,255,0.3)",
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
                    </div>
                    <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 700, margin: "0 0 4px" }}>Vokapedia Admin</h1>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Masuk ke Dashboard Administrator</p>
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        padding: "12px 16px", borderRadius: 10, marginBottom: 20,
                        background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)",
                        color: "#fca5a5", fontSize: 13, textAlign: "center",
                    }}>{error}</div>
                )}

                {/* Form */}
                <form action={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                        <label style={{ display: "block", color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 6, fontWeight: 500 }}>Email</label>
                        <input
                            name="email" type="email" required
                            placeholder="admin@vokapedia.com"
                            style={{
                                width: "100%", padding: "12px 16px", borderRadius: 10,
                                border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)",
                                color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box",
                                transition: "border-color 0.2s",
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: "block", color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 6, fontWeight: 500 }}>Password</label>
                        <input
                            name="password" type="password" required
                            placeholder="••••••••"
                            style={{
                                width: "100%", padding: "12px 16px", borderRadius: 10,
                                border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)",
                                color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box",
                                transition: "border-color 0.2s",
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            marginTop: 8, padding: "14px", borderRadius: 10, border: "none",
                            background: loading ? "rgba(0,98,255,0.5)" : "linear-gradient(135deg, #0062FF, #3B82F6)",
                            color: "#fff", fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                            transition: "all 0.2s", boxShadow: "0 4px 15px rgba(0,98,255,0.3)",
                        }}
                    >
                        {loading ? "Memproses..." : "Masuk"}
                    </button>
                </form>
            </div>
        </div>
    );
}
