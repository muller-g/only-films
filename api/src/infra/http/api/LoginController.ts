import dotenv from "dotenv";
import { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import app from '../../server';
import LoginService from '../service/LoginService';
import logger from '../../../service/WinstonLogger';

dotenv.config();

export default class LoginController {
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        logger.info("Login routes start");

        app.post("/api/login", async (req: Request, res: Response) => {
            try {
                const { email, password } = req.body;
                const user: any = await LoginService.login(email, password);
    
                if(!user || typeof user === "string") {
                    res.status(403).send("Unauthorized");
                    return
                }
    
                const token = jwt.sign({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }, process.env.JWT_SECRET || '');
    
                return res.status(200).json({
                    user: user,
                    token: token
                });
            } catch (e){
                return res.status(500).json("Error");
            }
        });
    }
}
