import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'prisma/dev.db');
const sqlite = new Database(dbPath);
const adapter = new PrismaBetterSqlite3(sqlite);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- Database Verification ---');

  const prodi = await prisma.programStudi.findMany();
  console.log(`Program Studi: ${prodi.length} records`);
  prodi.forEach(p => console.log(`  - ${p.name}: iconAlt="${p.iconAlt}"`));

  const startups = await prisma.startup.findMany();
  console.log(`Startups: ${startups.length} records`);
  startups.forEach(s => console.log(`  - ${s.name}: bannerAlt="${s.bannerAlt}", profileAlt="${s.profileAlt}"`));

  const products = await prisma.product.findMany();
  console.log(`Products: ${products.length} records`);
  products.forEach(p => console.log(`  - ${p.title}: imageAlt="${p.imageAlt}"`));

  const berita = await prisma.berita.findMany();
  console.log(`Berita: ${berita.length} records`);
  berita.forEach(b => console.log(`  - ${b.judul}: gambarAlt="${b.gambarAlt}"`));

  const team = await prisma.teamMember.findMany();
  console.log(`Team Members: ${team.length} records`);
  team.forEach(t => console.log(`  - ${t.name}: photoAlt="${t.photoAlt}"`));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
