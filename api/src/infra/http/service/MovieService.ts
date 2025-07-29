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

    static async getById(id: string) {
        try {
            const movie: any = await prisma.movie.findUnique({
                where: { id },
                include: {
                    cover: true,
                    reviews: {
                        include: {
                            user: {
                                include: {
                                    profile_photo: true,
                                },
                            },
                        },
                    },
                },
            });

            const aggregate = await prisma.review.aggregate({
                where: {
                    movie_id: id,
                },
                _sum: {
                    rate: true,
                },
            });

            const similars = await prisma.movie.findMany({
                where: {
                    category: movie.category,

                },
                take: 5,
                include: {
                    cover: true,
                    _count: {
                        select: { reviews: true },
                    },
                },
            });

            return {
                ...movie,
                total_rate: aggregate._sum.rate ?? 0,
                similars: similars,
            };
        } catch (e: any) {
            return e.message;
        }
    }


    static async getReview(id: string){
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

    static async delete(id: string){
        try {
            return await prisma.movie.delete({
                where: {
                    id: id
                }
            });
        } catch (e: any){
            return e.message;
        }
    }

    static async getSimilarMovies(category: string) {
        try {
            return await prisma.movie.findMany({
                where: {
                    category: category,
                },
                include: {
                    cover: true,
                    _count: {
                        select: { reviews: true },
                    },
                },
            });
        } catch (e: any) {
            return e.message;
        }
    }

    static async getAllMovies() {
        try {
            const movies = await prisma.movie.findMany({
            include: {
                cover: true,
                _count: {
                select: { reviews: true },
                },
            },
            });

            const moviesWithRate = await Promise.all(
            movies.map(async (movie) => {
                const rateAggregate = await prisma.review.aggregate({
                where: { movie_id: movie.id },
                _avg: {
                    rate: true,
                },
                });

                return {
                ...movie,
                averageRate: rateAggregate._avg.rate ?? 0,
                };
            })
            );

            return moviesWithRate;
        } catch (e: any) {
            return e.message;
        }
    }
}