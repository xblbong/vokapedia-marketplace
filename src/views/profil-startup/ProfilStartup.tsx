"use client";

import { useState } from "react";
import Pagination from "@/src/components/Pagination/Pagination";
import { StartupCard } from "@/src/components/StartupCard/StartupCard";

// Contoh Data Dinamis
const startupData = [
    {
        id: "1",
        name: "Pop Ame",
        department: "Desain Grafis",
        description: "Produk dekoratif olahan limbah tempurung kelapa dengan desain sederhana, dan elegan.",
        teamPhotos: ["/images/png/a.png", "/images/png/b.png", "/images/png/c.png", "/images/png/d.png"]
    },
    {
        id: "2",
        name: "Ravière",
        department: "Desain Grafis",
        description: "Produk dekoratif olahan limbah tempurung kelapa dengan desain sederhana, dan elegan.",
        teamPhotos: ["/images/png/a.png", "/images/png/b.png", "/images/png/c.png", "/images/png/d.png"]
    },
    {
        id: "3",
        name: "Ravière",
        department: "Desain Grafis",
        description: "Produk dekoratif olahan limbah tempurung kelapa dengan desain sederhana, dan elegan.",
        teamPhotos: ["/images/png/a.png", "/images/png/b.png", "/images/png/c.png", "/images/png/d.png"]
    },
    {
        id: "4",
        name: "Ravière",
        department: "Desain Grafis",
        description: "Produk dekoratif olahan limbah tempurung kelapa dengan desain sederhana, dan elegan.",
        teamPhotos: ["/images/png/a.png", "/images/png/b.png", "/images/png/c.png", "/images/png/d.png"]
    },
    {
        id: "5",
        name: "Ravière",
        department: "Desain Grafis",
        description: "Produk dekoratif olahan limbah tempurung kelapa dengan desain sederhana, dan elegan.",
        teamPhotos: ["/images/png/a.png", "/images/png/b.png", "/images/png/c.png", "/images/png/d.png"]
    },
    {
        id: "6",
        name: "Ravière",
        department: "Desain Grafis",
        description: "Produk dekoratif olahan limbah tempurung kelapa dengan desain sederhana, dan elegan.",
        teamPhotos: ["/images/png/a.png", "/images/png/b.png", "/images/png/c.png", "/images/png/d.png"]
    },
    {
        id: "7",
        name: "Ravière",
        department: "Desain Grafis",
        description: "Produk dekoratif olahan limbah tempurung kelapa dengan desain sederhana, dan elegan.",
        teamPhotos: ["/images/png/a.png", "/images/png/b.png", "/images/png/c.png", "/images/png/d.png"]
    },
    {
        id: "8",
        name: "Ravière",
        department: "Desain Grafis",
        description: "Produk dekoratif olahan limbah tempurung kelapa dengan desain sederhana, dan elegan.",
        teamPhotos: ["/images/png/a.png", "/images/png/b.png", "/images/png/c.png", "/images/png/d.png"]
    },
    {
        id: "9",
        name: "Ravière",
        department: "Desain Grafis",
        description: "Produk dekoratif olahan limbah tempurung kelapa dengan desain sederhana, dan elegan.",
        teamPhotos: ["/images/png/a.png", "/images/png/b.png", "/images/png/c.png", "/images/png/d.png"]
    },
    // Tambahkan data lainnya...
];

export default function ProfilStartupPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 3;

    return (
        <div className="layout-container mt-24 px-4 py-10">
            <h1 className="text-[24px] font-bold mb-8 text-[#1E1E1E]">Profil Startup</h1>

            {/* Responsive Grid System */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] justify-items-center">
                {startupData.map((startup) => (
                    <StartupCard key={startup.id} startup={startup} />
                ))}
            </div>

            {/* Pagination (Opsional) */}
            <div className="flex justify-center mt-12 gap-2">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
        </div>
    );
}