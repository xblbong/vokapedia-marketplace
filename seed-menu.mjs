import { PrismaClient } from './src/app/generated/prisma/index.js';
const prisma = new PrismaClient();

async function main() {
  await prisma.menuOverlayItem.createMany({
    data: [
      { sectionName: 'Berita Terbaru', label: 'Berita Terbaru tentang Vokasi UB', url: '/berita', order: 1 },
      { sectionName: 'Berita Terbaru', label: 'Kegiatan Mahasiswa Vokasi UB', url: '/kegiatan', order: 2 },
      { sectionName: 'Program', label: 'Entrepreneurship Showcase', url: '/showcase', order: 1 },
      { sectionName: 'Program', label: 'Tujuan & Konsep Program', url: '/halaman/tujuan', order: 2 },
      { sectionName: 'Program', label: 'Badan Inovasi & Kewirausahaan', url: '/halaman/badan-inovasi', order: 3 },
      { sectionName: 'Program', label: 'Teaching Factory', url: '/halaman/teaching-factory', order: 4 },
    ],
  });
  await prisma.halaman.create({
    data: {
      title: 'Badan Inovasi & Kewirausahaan',
      slug: 'badan-inovasi',
      content: 'Selamat datang di BIK. \n\nIni adalah halaman statis yang dibuat dari sistem CMS baru. Anda dapat mengubah isi teks ini kapan saja melalui menu Manajemen Halaman di Dashboard. \n\nSilakan isi sesuai dengan deskripsi divisi yang sebenarnya.'
    }
  });
  console.log('Seeded Menu and Halaman successfully!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
