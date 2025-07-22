import { prisma } from "../../database/client";

export default class ReviewService {
    static async create(review: any){
        try {
            return await prisma.review.create({
                data: {
                    user_id: review.userId,
                    movie_id: review.movieId,
                    review: review.review,
                    rate: review.rate,
                }
            });
        } catch (e: any){
            return e.message;
        }
    }

    static async getMovieByTitle(title: string){
        try {
            return await prisma.movie.findMany({
                where: {
                    title: {
                        contains: title,
                        mode: 'insensitive'
                    }
                },
                include: {
                    cover: true
                }
            });
        } catch (e: any){
            return e.message;
        }
    }

    static async getReview(movieId: string){ 
        try {
            return await prisma.review.findMany({
                where: {
                    movie_id: movieId
                },
                include: {
                    movie: {
                        include: {
                            cover: true
                        }
                    },
                    user: {
                        include: {
                            profile_photo: true
                        }
                    }
                }
            });
        } catch (e: any){
            return e.message;
        }
    }

    static async getAllReviews(){
        try {
            return await prisma.review.findMany({
                orderBy: {
                    created_at: 'desc'
                },
                include: {
                    movie: {
                        include: {
                            cover: true
                        }
                    },
                    user: true
                }
            });
        } catch (e: any){
            return e.message;
        }
    }

    static async getReviewsByUserId(userId: string){
        try {
            return await prisma.review.findMany({
                where: {
                    user_id: userId
                },
                include: {
                    movie: {
                        include: {
                            cover: true
                        }
                    }
                }
            });
        } catch (e: any){
            return e.message;
        }
    }

    static async delete(id: string){
        try {
            return await prisma.review.delete({
                where: {
                    id: id
                }
            });
        } catch (e: any){
            return e.message;
        }
    }
}