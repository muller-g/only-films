"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../../database/client");
class ReviewService {
    static async create(review) {
        try {
            return await client_1.prisma.review.create({
                data: {
                    user_id: review.userId,
                    movie_id: review.movieId,
                    review: review.review,
                    rate: review.rate,
                }
            });
        }
        catch (e) {
            return e.message;
        }
    }
    static async getMovieByTitle(title) {
        try {
            return await client_1.prisma.movie.findMany({
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
        }
        catch (e) {
            return e.message;
        }
    }
    static async getReview(movieId) {
        try {
            return await client_1.prisma.review.findMany({
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
        }
        catch (e) {
            return e.message;
        }
    }
    static async getAllReviews() {
        try {
            return await client_1.prisma.review.findMany({
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
        }
        catch (e) {
            return e.message;
        }
    }
    static async getReviewsByUserId(userId) {
        try {
            return await client_1.prisma.review.findMany({
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
        }
        catch (e) {
            return e.message;
        }
    }
}
exports.default = ReviewService;
