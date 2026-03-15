import ProfilStartupPage from '@/src/views/profil-startup/ProfilStartup'
import React from 'react'
import { prisma } from "@/src/lib/prisma";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10);
  const limit = 6;
  const skip = (currentPage - 1) * limit;

  const [rawStartups, totalCount] = await Promise.all([
    prisma.startup.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        programStudi: true,
        teamMembers: true,
      }
    }),
    prisma.startup.count()
  ]);

  const totalPages = Math.ceil(totalCount / limit) || 1;

  const startups = rawStartups.map(s => ({
    id: s.id.toString(),
    name: s.name,
    department: s.programStudi.name,
    description: s.description,
    teamPhotos: s.teamMembers.map(m => m.photo || "/images/svg/pp-akun.svg")
  }));

  return (
    <div>
      <ProfilStartupPage startups={startups} currentPage={currentPage} totalPages={totalPages} />
    </div>
  )
}
