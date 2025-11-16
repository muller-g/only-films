/*
  Warnings:

  - You are about to drop the `Genre` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Genre";

-- CreateTable
CREATE TABLE "MovieGenre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tmdb_id" INTEGER NOT NULL,

    CONSTRAINT "MovieGenre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TvGenre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tmdb_id" INTEGER NOT NULL,

    CONSTRAINT "TvGenre_pkey" PRIMARY KEY ("id")
);
