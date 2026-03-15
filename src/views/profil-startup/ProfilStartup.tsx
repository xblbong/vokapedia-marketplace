"use client";

import Pagination from "@/src/components/Pagination/Pagination";
import { StartupCard } from "@/src/components/StartupCard/StartupCard";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface ProfilStartupProps {
    startups: {
        id: string;
        name: string;
        department: string;
        description: string;
        teamPhotos: string[];
    }[];
    currentPage: number;
    totalPages: number;
}

export default function ProfilStartupPage({ startups, currentPage, totalPages }: ProfilStartupProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const handlePageChange = (page: number) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set("page", page.toString());
        router.push(`${pathname}?${current.toString()}`, { scroll: true });
    };

    return (
        <div className="layout-container mt-24 px-4 pt-10 pb-20">
            <h1 className="text-[24px] font-bold mb-8 text-[#1E1E1E]">Profil Startup</h1>

            {/* Responsive Grid System */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] justify-items-center">
                {startups.map((startup) => (
                    <StartupCard key={startup.id} startup={startup} />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
}