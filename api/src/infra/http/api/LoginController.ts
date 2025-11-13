import dotenv from "dotenv";
import { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import app from '../../server';
import LoginService from '../service/LoginService';
import logger from '../../../service/WinstonLogger';
import UserService from "../service/UserService";
import nodemailer from 'nodemailer';

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

        app.post("/api/reset-password", async (req: Request, res: Response) => {
            try {
                const { email } = req.body;

                const user = await UserService.getByEmail(email);
    
                if(!user) {
                    return res.status(404).json({
                        message: "Invalid email"
                    });
                }

                const transporter = nodemailer.createTransport({
                    host: "smtp-relay.brevo.com",
                    port: 587,
                    secure: false,
                    tls: {
                        ciphers: "SSLv3",
                        rejectUnauthorized: false,
                    },
                    auth: {
                        user: process.env.NODEMAILER_MAIL,
                        pass: process.env.NODEMAILER_PASS
                    }
                });

                const token = jwt.sign({
                    id: user.id,
                    email: user.email
                }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
                
                try {
                    await transporter.sendMail({
                        from: '"OnlyFilms" <postmaster@onlyfilms.com.br>',
                        to: email,
                        subject: "OnlyFilms - Recuperação de senha",
                        text: "Clique no link abaixo para resetar sua senha: " + process.env.FRONTEND_URL + "/reset-password?token=" + token,
                        html: "<b>Clique no link abaixo para resetar sua senha: <a href='" + process.env.FRONTEND_URL + "/reset-password?token=" + token + "'>Resetar senha</a></b>",
                    });
                
                } catch (err) {
                    return res.status(500).json({ message: "Error in server email service" });
                }

                return res.status(200).json({ message: "Password reset email sent" });
            } catch (e){
                return res.status(500).json({ message: "Error" });
            }
        });

        app.post("/api/reset-new-password", async (req: Request, res: Response) => {
            try {
                const { user_token, password } = req.body;

                const decoded = jwt.verify(user_token, process.env.JWT_SECRET || '');

                if(!decoded || typeof decoded === "string") {
                    return res.status(401).json({ message: "Invalid token" });
                }

                const user = await UserService.getById(decoded.id);

                if(!user) {
                    return res.status(404).json({ message: "User not found" });
                }

                await UserService.updatePassword(user.id, password);

                return res.status(200).json({ message: "Password reset successfully" });
            } catch (e){
                return res.status(500).json({ message: "Error" });
            }
        });
    }
}
