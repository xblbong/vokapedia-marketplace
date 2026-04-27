import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'prisma/dev.db');
const db = new Database(dbPath, { readonly: true });

console.log('=== DATABASE VERIFICATION (direct SQLite) ===\n');

// Tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', tables.map(t => t.name).join(', '), '\n');

// ProgramStudi
try {
  const prodi = db.prepare('SELECT id, name, iconAlt FROM ProgramStudi').all();
  console.log(`ProgramStudi (${prodi.length} records):`);
  prodi.forEach(p => console.log(`  [${p.id}] ${p.name} — iconAlt: "${p.iconAlt}"`));
} catch(e) { console.log('ProgramStudi error:', e.message); }

// Startup
console.log();
try {
  const startups = db.prepare('SELECT id, name, bannerAlt, profileAlt, bannerImage, profileImage FROM Startup').all();
  console.log(`Startup (${startups.length} records):`);
  startups.forEach(s => console.log(`  [${s.id}] ${s.name}\n       bannerAlt="${s.bannerAlt}" bannerImage="${s.bannerImage}"\n       profileAlt="${s.profileAlt}" profileImage="${s.profileImage}"`));
} catch(e) { console.log('Startup error:', e.message); }

// Product
console.log();
try {
  const products = db.prepare('SELECT id, title, imageAlt, image FROM Product').all();
  console.log(`Product (${products.length} records):`);
  products.forEach(p => console.log(`  [${p.id}] ${p.title} — imageAlt="${p.imageAlt}" image="${p.image}"`));
} catch(e) { console.log('Product error:', e.message); }

// Berita
console.log();
try {
  const berita = db.prepare('SELECT id, judul, gambarAlt, gambar, isi_berita FROM Berita LIMIT 10').all();
  console.log(`Berita (${berita.length} records):`);
  berita.forEach(b => {
    const preview = b.isi_berita ? b.isi_berita.substring(0, 80).replace(/\n/g, ' ') : '';
    console.log(`  [${b.id}] ${b.judul}\n       gambarAlt="${b.gambarAlt}" gambar="${b.gambar}"\n       isi_berita preview: "${preview}..."`);
  });
} catch(e) { console.log('Berita error:', e.message); }

// TeamMember
console.log();
try {
  const team = db.prepare('SELECT id, name, photoAlt, photo FROM TeamMember').all();
  console.log(`TeamMember (${team.length} records):`);
  team.forEach(t => console.log(`  [${t.id}] ${t.name} — photoAlt="${t.photoAlt}" photo="${t.photo}"`));
} catch(e) { console.log('TeamMember error:', e.message); }

// Halaman
console.log();
try {
  const halaman = db.prepare('SELECT id, title, slug, content FROM Halaman').all();
  console.log(`Halaman (${halaman.length} records):`);
  halaman.forEach(h => {
    const preview = h.content ? h.content.substring(0, 100).replace(/\n/g, ' ') : '';
    console.log(`  [${h.id}] ${h.title} (/${h.slug})\n       content preview: "${preview}..."`);
  });
} catch(e) { console.log('Halaman error:', e.message); }

// MenuOverlayItem
console.log();
try {
  const menus = db.prepare('SELECT id, sectionName, label, url FROM MenuOverlayItem ORDER BY "order"').all();
  console.log(`MenuOverlayItem (${menus.length} records):`);
  menus.forEach(m => console.log(`  [${m.id}] [${m.sectionName}] ${m.label} → ${m.url}`));
} catch(e) { console.log('MenuOverlayItem error:', e.message); }

db.close();
console.log('\n=== DONE ===');
