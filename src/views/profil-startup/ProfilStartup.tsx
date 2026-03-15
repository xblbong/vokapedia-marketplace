"use client";

import { useState } from "react";
import Pagination from "@/src/components/Pagination/Pagination";
import { StartupCard } from "@/src/components/StartupCard/StartupCard";

interface ProfilStartupProps {
    startups: {
        id: string;
        name: string;
        department: string;
        description: string;
        teamPhotos: string[];
    }[];
}

export default function ProfilStartupPage({ startups }: ProfilStartupProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 3;

    return (
        <div className="layout-container mt-24 px-4 py-10">
            <h1 className="text-[24px] font-bold mb-8 text-[#1E1E1E]">Profil Startup</h1>

            {/* Responsive Grid System */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] justify-items-center">
                {startups.map((startup) => (
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