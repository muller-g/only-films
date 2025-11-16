import { Request, Response } from 'express';
import logger from '../../../service/WinstonLogger';
import app from '../../server';
import MovieGenreService from '../service/MovieGenreService';

export default class MovieGenresController {
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        logger.info("Movie genres routes start");

        app.get("/api/get-movie-genres", async (req: Request, res: Response) => {
            try {
                const movieGenres = await MovieGenreService.get();
    
                return res.status(200).json(movieGenres);
            } catch(e){
                return res.status(500).json("Error");
            }
        });
    }
}
