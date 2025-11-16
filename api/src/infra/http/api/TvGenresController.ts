import { Request, Response } from 'express';
import logger from '../../../service/WinstonLogger';
import app from '../../server';
import MovieGenreService from '../service/MovieGenreService';
import TvGenreService from '../service/TvGenreService';

export default class TvGenresController {
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        logger.info("Tv genres routes start");

        app.get("/api/get-tv-genres", async (req: Request, res: Response) => {
            try {
                const tvGenres = await TvGenreService.get();
    
                return res.status(200).json(tvGenres);
            } catch(e){
                return res.status(500).json("Error");
            }
        });
    }
}
