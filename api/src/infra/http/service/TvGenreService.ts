import { prisma } from "../../database/client";

export default class TvGenreService {
    static async create(genre: any){
        try {
            return await prisma.tvGenre.create({
                data: {
                    name: genre.name,
                    tmdb_id: genre.id,
                }
            });
        } catch (e: any){
            return e.message;
        }
    }

    static async getByTmdbId(tmdbId: number){
        try {
            return await prisma.tvGenre.findFirst({
                where: { tmdb_id: tmdbId }
            });
        } catch (e: any){
            return e.message;
        }
    }

    static async get() {
        try {
            return await prisma.tvGenre.findMany();
        } catch (e: any){
            return e.message;
        }
    }
}