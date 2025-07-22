-- DropForeignKey
ALTER TABLE "Movie" DROP CONSTRAINT "Movie_cover_id_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_profile_photo_id_fkey";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profile_photo_id_fkey" FOREIGN KEY ("profile_photo_id") REFERENCES "ImageFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_cover_id_fkey" FOREIGN KEY ("cover_id") REFERENCES "ImageFile"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
