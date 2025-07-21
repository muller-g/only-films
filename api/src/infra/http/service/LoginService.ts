import User from "src/entity/User";
import { prisma } from "../../database/client";
import bcrypt from "bcrypt";

export default class UserService {
    static async login(email: string, password: string){
        try {
            const user: User | any = await prisma.user.findFirst({
                where: {
                    email: email
                }
            });
            
            if(!await bcrypt.compare(password, user.password)){
                return undefined
            }

            return user;
        } catch (e: any){
            return e.message;
        }
    }
}