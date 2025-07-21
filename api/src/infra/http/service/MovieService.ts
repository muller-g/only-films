import { prisma } from "../../database/client";

export default class MovieService {
    static async create(movie: any){
        try {
            return await prisma.movie.create({
                data: {
                    title: movie.title,
                    category: movie.category,
                    release_date: movie.releaseDate,
                    cover_id: movie.coverId,
                }
            });
        } catch (e: any){
            return e.message;
        }
    }

    static async getByTitle(title: string){
        try {
            return await prisma.movie.findMany({
                where: {
                    title: {
                        contains: title,
                        mode: "insensitive"
                    }
                }
            });
        } catch (e: any){
            return e.message;
        }
    }

    static async getById(id: string){
        try {
            return await prisma.movie.findUnique({
                where: {
                    id: id
                }
            });
        } catch (e: any){
            return e.message;
        }
    }
}