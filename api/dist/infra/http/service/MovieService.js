"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../../database/client");
class MovieService {
    static async create(movie) {
        try {
            return await client_1.prisma.movie.create({
                data: {
                    title: movie.title,
                    category: movie.category,
                    release_date: movie.releaseDate,
                    cover_id: movie.coverId,
                }
            });
        }
        catch (e) {
            return e.message;
        }
    }
    static async getByTitle(title) {
        try {
            return await client_1.prisma.movie.findMany({
                where: {
                    title: {
                        contains: title,
                        mode: "insensitive"
                    }
                }
            });
        }
        catch (e) {
            return e.message;
        }
    }
    static async getById(id) {
        try {
            return await client_1.prisma.movie.findUnique({
                where: {
                    id: id
                }
            });
        }
        catch (e) {
            return e.message;
        }
    }
}
exports.default = MovieService;
