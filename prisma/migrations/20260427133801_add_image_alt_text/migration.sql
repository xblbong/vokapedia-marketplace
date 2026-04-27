-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Berita" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "isi_berita" TEXT NOT NULL,
    "gambar" TEXT NOT NULL DEFAULT '',
    "gambarAlt" TEXT NOT NULL DEFAULT '',
    "is_slider" BOOLEAN NOT NULL DEFAULT false,
    "section_type" TEXT NOT NULL DEFAULT 'TERBARU',
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "tags" TEXT NOT NULL DEFAULT '',
    "kategoriId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Berita_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "KategoriBerita" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Berita" ("createdAt", "gambar", "id", "is_slider", "isi_berita", "judul", "kategoriId", "section_type", "slug", "status", "tags", "updatedAt") SELECT "createdAt", "gambar", "id", "is_slider", "isi_berita", "judul", "kategoriId", "section_type", "slug", "status", "tags", "updatedAt" FROM "Berita";
DROP TABLE "Berita";
ALTER TABLE "new_Berita" RENAME TO "Berita";
CREATE UNIQUE INDEX "Berita_slug_key" ON "Berita"("slug");
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "price" REAL NOT NULL DEFAULT 0,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT NOT NULL DEFAULT '',
    "imageAlt" TEXT NOT NULL DEFAULT '',
    "startupId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "ecommerceUrl" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("categoryId", "createdAt", "description", "ecommerceUrl", "id", "image", "price", "startupId", "stock", "title", "updatedAt") SELECT "categoryId", "createdAt", "description", "ecommerceUrl", "id", "image", "price", "startupId", "stock", "title", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE TABLE "new_ProgramStudi" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "iconAlt" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_ProgramStudi" ("description", "icon", "id", "name") SELECT "description", "icon", "id", "name" FROM "ProgramStudi";
DROP TABLE "ProgramStudi";
ALTER TABLE "new_ProgramStudi" RENAME TO "ProgramStudi";
CREATE UNIQUE INDEX "ProgramStudi_name_key" ON "ProgramStudi"("name");
CREATE TABLE "new_Startup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "bannerImage" TEXT NOT NULL DEFAULT '',
    "bannerAlt" TEXT NOT NULL DEFAULT '',
    "profileImage" TEXT NOT NULL DEFAULT '',
    "profileAlt" TEXT NOT NULL DEFAULT '',
    "categoryId" INTEGER,
    "whatsappUrl" TEXT,
    "ecommerceUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Startup_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Startup" ("bannerImage", "categoryId", "createdAt", "description", "ecommerceUrl", "id", "name", "profileImage", "slug", "updatedAt", "whatsappUrl") SELECT "bannerImage", "categoryId", "createdAt", "description", "ecommerceUrl", "id", "name", "profileImage", "slug", "updatedAt", "whatsappUrl" FROM "Startup";
DROP TABLE "Startup";
ALTER TABLE "new_Startup" RENAME TO "Startup";
CREATE UNIQUE INDEX "Startup_slug_key" ON "Startup"("slug");
CREATE TABLE "new_TeamMember" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "photo" TEXT NOT NULL DEFAULT '',
    "photoAlt" TEXT NOT NULL DEFAULT '',
    "instagramUrl" TEXT,
    "startupId" INTEGER NOT NULL,
    "programStudiId" INTEGER,
    CONSTRAINT "TeamMember_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TeamMember_programStudiId_fkey" FOREIGN KEY ("programStudiId") REFERENCES "ProgramStudi" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TeamMember" ("id", "instagramUrl", "name", "photo", "programStudiId", "role", "startupId") SELECT "id", "instagramUrl", "name", "photo", "programStudiId", "role", "startupId" FROM "TeamMember";
DROP TABLE "TeamMember";
ALTER TABLE "new_TeamMember" RENAME TO "TeamMember";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
