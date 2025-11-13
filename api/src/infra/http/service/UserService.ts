import User from "src/entity/User";
import { prisma } from "../../database/client";
import bcrypt from "bcrypt";

export default class UserService {
    static async create(user: User){
        try {
            return await prisma.user.create({
                data: user
            });
        } catch (e: any){
            return e.message;
        }
    }

    static async update(user: any){
        try {
            return await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    name: user.name,
                    bio: user.bio,
                    ...(user.profile_photo_id && { profile_photo_id: user.profile_photo_id })
                }
            });
        } catch (e: any){
            return e.message;
        }
    }

    static async updatePassword(userId: string, password: string){
        try {
            let crypted: string = await bcrypt.hash(password, 8)

            return await prisma.user.update({
                where: { id: userId },
                data: { password: crypted }
            });
        } catch (e: any){
            return e.message;
        }
    }

    static async getProfileStats(userId: string){
        try {
            return await prisma.review.count({
                where: {
                    user_id: userId
                },
            });
        } catch (e: any){
            return e.message;
        }
    }

    static async getById(userId: string){
        try {
            return await prisma.user.findUnique({
                where: {
                    id: userId
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    created_at: true,
                    profile_photo: true,
                    bio: true,
                }
            });
        } catch (e: any){
            return e.message;
        }
    }

    static async get(){
        try {
            return await prisma.user.findMany({});
        } catch (e: any){
            return e.message;
        }
    }

    static async getByEmail(email: string){
        try {
            return await prisma.user.findUnique({
                where: { email: email }
            });
        } catch (e: any){
            return e.message;
        }
    }
}