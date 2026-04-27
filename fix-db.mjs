/**
 * Script: Cleanup & Fix Database
 * - Hapus duplikat TeamMember (seed ran 2x)
 * - Hapus duplikat Product (seed ran 2x)
 * - Update iconAlt, bannerAlt, profileAlt, photoAlt yang masih kosong
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'prisma/dev.db');
const db = new Database(dbPath);

console.log('=== DATABASE CLEANUP & FIX ===\n');

// ================================================================
// 1. Hapus duplikat TeamMember
//    Seed ran twice → 8 records, seharusnya 4 unik per startup
// ================================================================
console.log('1. Fixing duplicate TeamMembers...');
const allMembers = db.prepare(`
  SELECT id, name, role, startupId FROM TeamMember ORDER BY id ASC
`).all();

const seen = new Set();
const toDeleteMembers = [];

for (const m of allMembers) {
  const key = `${m.startupId}-${m.name}-${m.role}`;
  if (seen.has(key)) {
    toDeleteMembers.push(m.id);
  } else {
    seen.add(key);
  }
}

if (toDeleteMembers.length > 0) {
  const del = db.prepare(`DELETE FROM TeamMember WHERE id = ?`);
  const deleteMany = db.transaction((ids) => {
    for (const id of ids) del.run(id);
  });
  deleteMany(toDeleteMembers);
  console.log(`   ✅ Deleted ${toDeleteMembers.length} duplicate TeamMembers (IDs: ${toDeleteMembers.join(', ')})`);
} else {
  console.log('   ✅ No duplicate TeamMembers found');
}

// ================================================================
// 2. Hapus duplikat Product
//    Seed ran twice → Keychain & PIN muncul 2x
// ================================================================
console.log('\n2. Fixing duplicate Products...');
const allProducts = db.prepare(`
  SELECT id, title, startupId FROM Product ORDER BY id ASC
`).all();

const seenProd = new Set();
const toDeleteProds = [];

for (const p of allProducts) {
  const key = `${p.startupId}-${p.title}`;
  if (seenProd.has(key)) {
    toDeleteProds.push(p.id);
  } else {
    seenProd.add(key);
  }
}

if (toDeleteProds.length > 0) {
  const delProd = db.prepare(`DELETE FROM Product WHERE id = ?`);
  const deleteManyProd = db.transaction((ids) => {
    for (const id of ids) delProd.run(id);
  });
  deleteManyProd(toDeleteProds);
  console.log(`   ✅ Deleted ${toDeleteProds.length} duplicate Products (IDs: ${toDeleteProds.join(', ')})`);
} else {
  console.log('   ✅ No duplicate Products found');
}

// ================================================================
// 3. Update iconAlt kosong di ProgramStudi
// ================================================================
console.log('\n3. Updating empty iconAlt in ProgramStudi...');
const prodiList = db.prepare(`SELECT id, name, iconAlt FROM ProgramStudi`).all();
const updateProdiAlt = db.prepare(`UPDATE ProgramStudi SET iconAlt = ? WHERE id = ?`);

const prodiAltMap = {
  'Teknologi Informasi': 'Ikon program studi Teknologi Informasi',
  'Administrasi Bisnis': 'Ikon program studi Administrasi Bisnis',
  'Keuangan & Perbankan': 'Ikon program studi Keuangan dan Perbankan',
  'Manajemen Perhotelan': 'Ikon program studi Manajemen Perhotelan',
  'Desain Grafis': 'Ikon program studi Desain Grafis',
};

for (const prodi of prodiList) {
  if (!prodi.iconAlt) {
    const alt = prodiAltMap[prodi.name] || `Ikon ${prodi.name}`;
    updateProdiAlt.run(alt, prodi.id);
    console.log(`   ✅ ProgramStudi[${prodi.id}] ${prodi.name} → iconAlt="${alt}"`);
  } else {
    console.log(`   ⏭  ProgramStudi[${prodi.id}] ${prodi.name} → sudah ada: "${prodi.iconAlt}"`);
  }
}

// ================================================================
// 4. Update bannerAlt & profileAlt kosong di Startup
// ================================================================
console.log('\n4. Updating empty alt text in Startup...');
const startups = db.prepare(`SELECT id, name, bannerAlt, profileAlt, bannerImage, profileImage FROM Startup`).all();
const updateStartupAlts = db.prepare(`UPDATE Startup SET bannerAlt = ?, profileAlt = ? WHERE id = ?`);

for (const s of startups) {
  const bannerAlt = s.bannerAlt || (s.bannerImage ? `Banner startup ${s.name}` : '');
  const profileAlt = s.profileAlt || (s.profileImage ? `Logo startup ${s.name}` : '');
  if (bannerAlt !== s.bannerAlt || profileAlt !== s.profileAlt) {
    updateStartupAlts.run(bannerAlt, profileAlt, s.id);
    console.log(`   ✅ Startup[${s.id}] ${s.name} → bannerAlt="${bannerAlt}", profileAlt="${profileAlt}"`);
  } else {
    console.log(`   ⏭  Startup[${s.id}] ${s.name} → alt sudah diisi`);
  }
}

// ================================================================
// 5. Update photoAlt kosong di TeamMember
// ================================================================
console.log('\n5. Updating empty photoAlt in TeamMember...');
const membersAfter = db.prepare(`SELECT id, name, photoAlt, photo FROM TeamMember`).all();
const updatePhotoAlt = db.prepare(`UPDATE TeamMember SET photoAlt = ? WHERE id = ?`);

for (const m of membersAfter) {
  if (!m.photoAlt && m.photo) {
    const alt = `Foto anggota tim ${m.name}`;
    updatePhotoAlt.run(alt, m.id);
    console.log(`   ✅ TeamMember[${m.id}] ${m.name} → photoAlt="${alt}"`);
  } else {
    console.log(`   ⏭  TeamMember[${m.id}] ${m.name} → ${m.photo ? `alt="${m.photoAlt}"` : 'no photo'}`);
  }
}

// ================================================================
// 6. Update imageAlt kosong di Product (hanya yang punya image)
// ================================================================
console.log('\n6. Updating empty imageAlt in Product...');
const products = db.prepare(`SELECT id, title, imageAlt, image FROM Product`).all();
const updateImageAlt = db.prepare(`UPDATE Product SET imageAlt = ? WHERE id = ?`);

for (const p of products) {
  if (!p.imageAlt && p.image) {
    const alt = `Gambar produk ${p.title}`;
    updateImageAlt.run(alt, p.id);
    console.log(`   ✅ Product[${p.id}] ${p.title} → imageAlt="${alt}"`);
  } else if (!p.image) {
    console.log(`   ⏭  Product[${p.id}] ${p.title} → no image yet`);
  } else {
    console.log(`   ⏭  Product[${p.id}] ${p.title} → alt="${p.imageAlt}"`);
  }
}

// ================================================================
// FINAL REPORT
// ================================================================
console.log('\n=== FINAL DATABASE STATE ===\n');

const finalProdi = db.prepare('SELECT id, name, iconAlt FROM ProgramStudi').all();
console.log(`ProgramStudi (${finalProdi.length} records):`);
finalProdi.forEach(p => console.log(`  [${p.id}] ${p.name} → iconAlt="${p.iconAlt}"`));

const finalStartups = db.prepare('SELECT id, name, bannerAlt, profileAlt FROM Startup').all();
console.log(`\nStartup (${finalStartups.length} records):`);
finalStartups.forEach(s => console.log(`  [${s.id}] ${s.name} → bannerAlt="${s.bannerAlt}", profileAlt="${s.profileAlt}"`));

const finalProducts = db.prepare('SELECT id, title, imageAlt, image FROM Product').all();
console.log(`\nProduct (${finalProducts.length} records):`);
finalProducts.forEach(p => console.log(`  [${p.id}] ${p.title} → imageAlt="${p.imageAlt}" image="${p.image}"`));

const finalMembers = db.prepare('SELECT id, name, photoAlt, photo FROM TeamMember').all();
console.log(`\nTeamMember (${finalMembers.length} records):`);
finalMembers.forEach(m => console.log(`  [${m.id}] ${m.name} → photoAlt="${m.photoAlt}"`));

const finalBerita = db.prepare('SELECT COUNT(*) as count FROM Berita').get();
console.log(`\nBerita: ${finalBerita.count} records`);

const finalHalaman = db.prepare('SELECT COUNT(*) as count FROM Halaman').get();
console.log(`Halaman: ${finalHalaman.count} records`);

const finalMenu = db.prepare('SELECT COUNT(*) as count FROM MenuOverlayItem').get();
console.log(`MenuOverlayItem: ${finalMenu.count} records`);

db.close();
console.log('\n=== CLEANUP SELESAI ✅ ===');
