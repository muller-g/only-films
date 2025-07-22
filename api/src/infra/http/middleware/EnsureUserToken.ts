import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default class EnsureUserToken {
    static async validate(req: any, res: any, next: any){
        if (!req.headers.authorization) {
            return res.status(401).json({ message: 'Token unsend' });
        }

        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || '');

            req.token = token;
            req.context = {
                toke: token,
                user: decoded
            }

            next();
        } catch (e){
            return res.status(401).json({ message: 'Invalid token' });
        }
    }

    static async noAuth(req: any, res: any, next: any){
        next();
    };
}