import { Request, Response } from 'express';
import app from '../../server';
import User from '../../../entity/User';
import UserService from '../service/UserService';
import EnsureUserToken from '../middleware/EnsureUserToken';
import logger from '../../../service/WinstonLogger';
import ReviewService from '../service/ReviewService';
import MovieService from '../service/MovieService';

export default class AdminController {
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        logger.info("Admin routes start");

        app.get("/api/admin-dashboard", EnsureUserToken.validate, async (req: Request | any, res: Response) => {
            try {
                let isAdmin = req.context.user.role === "admin";

                if(!isAdmin) {
                    return res.status(403).json({message: "Unauthorized"});
                }

                let reviews = await ReviewService.getAllReviews();
                let users = await UserService.get();
                let movies = await MovieService.getAllMovies();

                return res.status(200).json({
                    reviews: reviews,
                    users: users,
                    movies: movies
                });
            } catch(e){
                return res.status(500).json("Error");
            }
        });
    }
}
