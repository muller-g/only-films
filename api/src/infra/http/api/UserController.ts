import { Request, Response } from 'express';
import app from '../../server';
import User from '../../../entity/User';
import UserService from '../service/UserService';
import EnsureUserToken from '../middleware/EnsureUserToken';
import logger from '../../../service/WinstonLogger';
import { createMulter } from '../../../service/multer';
import ImageFileService from '../service/ImageFileService';

export default class UserController {
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        logger.info("User routes start");

        app.post("/api/register", async (req: Request, res: Response) => {
            try {
                const { name, email, password } = req.body;
                const user: User = await User.createUser(
                    name,
                    email,
                    password
                );

                let createdUser = await UserService.create(user);

                if(typeof createdUser === "object" && createdUser.hasOwnProperty("created_at")) {
                    return res.status(200).json(createdUser);
                }
    
                return res.status(500).json(createdUser);
            } catch(e){
                return res.status(500).json("Error");
            }
        });

        app.get("/api/profile/:id", EnsureUserToken.validate, async (req: Request, res: Response) => {
            try {
                const userId = req.params.id;

                let user = await UserService.getById(userId);

                if(!user) {
                    return res.status(404).json("User not found");
                }

                return res.status(200).json(user);
            } catch(e){
                return res.status(500).json("Error");
            } 
        });

        app.post("/api/profile-update", EnsureUserToken.validate, async (req: Request, res: Response) => {
            try {
                const uploadMiddleware = createMulter((req: any) => {
                    return `uploads/users/${req.body.id}`;
                }).single('coverPhoto');
            
                uploadMiddleware(req, res, async (err) => {
                    let reqFile: any = req.file;

                    let imgFile = {
                        name: reqFile.filename,
                        path: reqFile.destination,
                        originalName: reqFile.originalname
                    };

                    let createdUserFile = await ImageFileService.create(imgFile);

                    const { name, id } = req.body;

                    let userCreated = await UserService.update({
                        name: name,
                        id: id,
                        profile_photo_id: createdUserFile.id
                    });    
                    
                });

                return res.status(200).json({message: "Profile updated successfully"});

            } catch(e){
                return res.status(500).json("Error");
            } 
        });

        app.get("/api/users", EnsureUserToken.validate, async (req: Request, res: Response) => {
            try {
                return res.status(200).json(await UserService.get());
            } catch(e){
                return res.status(500).json("Error");
            } 
        });
    }
}
