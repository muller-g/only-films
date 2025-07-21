"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../../database/client");
class UserService {
    static async create(user) {
        try {
            return await client_1.prisma.user.create({
                data: user
            });
        }
        catch (e) {
            return e.message;
        }
    }
    static async update(user) {
        try {
            return await client_1.prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    name: user.name,
                    profile_photo_id: user.profile_photo_id
                }
            });
        }
        catch (e) {
            return e.message;
        }
    }
    static async getById(userId) {
        try {
            return await client_1.prisma.user.findUnique({
                where: {
                    id: userId
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    created_at: true,
                    profile_photo: true
                }
            });
        }
        catch (e) {
            return e.message;
        }
    }
    static async get() {
        try {
            return await client_1.prisma.user.findMany({});
        }
        catch (e) {
            return e.message;
        }
    }
}
exports.default = UserService;
