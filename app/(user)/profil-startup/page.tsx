import ProfilStartupPage from '@/src/views/profil-startup/ProfilStartup'
import React from 'react'
import { prisma } from "@/src/lib/prisma";

export default async function page() {
  const rawStartups = await prisma.startup.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      programStudi: true,
      teamMembers: true,
    }
  });

  const startups = rawStartups.map(s => ({
    id: s.id.toString(),
    name: s.name,
    department: s.programStudi.name,
    description: s.description,
    teamPhotos: s.teamMembers.map(m => m.photo || "/images/svg/pp-akun.svg")
  }));

  return (
    <div>
      <ProfilStartupPage startups={startups} />
    </div>
  )
}
