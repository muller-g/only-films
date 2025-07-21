-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profile_photo_id" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profile_photo_id_fkey" FOREIGN KEY ("profile_photo_id") REFERENCES "ImageFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
