"use client";

import { useState } from "react";
import { loginAdmin } from "@/src/lib/auth";
import { Lock, Mail } from "lucide-react";
import Image from "next/image";

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
        <div className="min-h-screen bg-[var(--color-page-bg)] flex items-center justify-center font-[var(--font-dm-sans)]">
            <div className="w-full max-w-[420px] p-10 bg-white rounded-2xl border border-gray-200 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                {/* Logo */}
                <div className="text-center mb-8 flex flex-col items-center">
                    <Image
                        src="/images/svg/logo-vokapedia.svg"
                        alt="Logo Vokapedia"
                        width={160}
                        height={40}
                        className="mx-auto my-5"
                    />

                    <p className="text-sm">
                        Masuk ke Dashboard Administrator
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="py-3 px-4 rounded-[10px] mb-5 bg-red-500/5 border border-red-500/15 text-[var(--color-brand-red)] text-[13px] text-center">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form action={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="flex items-center gap-1.5 text-[var(--color-inactive-text)] text-[13px] mb-1.5 font-medium">
                            <Mail size={14} /> Email
                        </label>
                        <input
                            name="email" type="email" required
                            placeholder="Masukan Email"
                            className="w-full py-3 px-4 rounded-[10px] border border-[var(--color-border-gray)] bg-white text-[var(--color-main-text)] text-sm outline-none transition-colors duration-200 focus:border-[var(--color-brand-blue)]"
                        />
                    </div>
                    <div>
                        <label className="flex items-center gap-1.5 text-[var(--color-inactive-text)] text-[13px] mb-1.5 font-medium">
                            <Lock size={14} /> Password
                        </label>
                        <input
                            name="password" type="password" required
                            placeholder="Masukan Password"
                            className="w-full py-3 px-4 rounded-[10px] border border-[var(--color-border-gray)] bg-white text-[var(--color-main-text)] text-sm outline-none transition-colors duration-200 focus:border-[var(--color-brand-blue)]"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`mt-2 py-3.5 rounded-[10px] border-none text-white text-[15px] font-semibold transition-all duration-200 shadow-[0_4px_15px_rgba(0,98,255,0.2)] ${loading
                            ? "bg-[var(--color-brand-blue)]/50 cursor-not-allowed"
                            : "bg-gradient-to-br from-[#0062FF] to-[#3B82F6] cursor-pointer hover:shadow-[0_6px_20px_rgba(0,98,255,0.3)]"
                            }`}
                    >
                        {loading ? "Memproses..." : "Masuk"}
                    </button>
                </form>
            </div>
        </div>
    );
}
