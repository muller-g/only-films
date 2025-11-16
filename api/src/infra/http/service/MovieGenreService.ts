import { prisma } from "../../database/client";

export default class MovieGenreService {
    static async create(genre: any){
        try {
            return await prisma.movieGenre.create({
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
            return await prisma.movieGenre.findFirst({
                where: { tmdb_id: tmdbId }
            });
        } catch (e: any){
            return e.message;
        }
    }

    static async get() {
        try {
            return await prisma.movieGenre.findMany();
        } catch (e: any){
            return e.message;
        }
    }
}