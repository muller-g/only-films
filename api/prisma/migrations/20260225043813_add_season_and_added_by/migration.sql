-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "added_by_id" TEXT;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "season_number" INTEGER;

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_added_by_id_fkey" FOREIGN KEY ("added_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
