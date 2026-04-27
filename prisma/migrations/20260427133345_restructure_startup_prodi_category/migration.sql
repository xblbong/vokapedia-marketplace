/*
  Warnings:

  - You are about to drop the column `programStudiId` on the `Startup` table. All the data in the column will be lost.
  - You are about to drop the column `studyProgram` on the `TeamMember` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Startup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "bannerImage" TEXT NOT NULL DEFAULT '',
    "profileImage" TEXT NOT NULL DEFAULT '',
    "categoryId" INTEGER,
    "whatsappUrl" TEXT,
    "ecommerceUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Startup_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Startup" ("bannerImage", "createdAt", "description", "ecommerceUrl", "id", "name", "profileImage", "slug", "updatedAt", "whatsappUrl") SELECT "bannerImage", "createdAt", "description", "ecommerceUrl", "id", "name", "profileImage", "slug", "updatedAt", "whatsappUrl" FROM "Startup";
DROP TABLE "Startup";
ALTER TABLE "new_Startup" RENAME TO "Startup";
CREATE UNIQUE INDEX "Startup_slug_key" ON "Startup"("slug");
CREATE TABLE "new_TeamMember" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "photo" TEXT NOT NULL DEFAULT '',
    "instagramUrl" TEXT,
    "startupId" INTEGER NOT NULL,
    "programStudiId" INTEGER,
    CONSTRAINT "TeamMember_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TeamMember_programStudiId_fkey" FOREIGN KEY ("programStudiId") REFERENCES "ProgramStudi" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TeamMember" ("id", "instagramUrl", "name", "photo", "role", "startupId") SELECT "id", "instagramUrl", "name", "photo", "role", "startupId" FROM "TeamMember";
DROP TABLE "TeamMember";
ALTER TABLE "new_TeamMember" RENAME TO "TeamMember";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
