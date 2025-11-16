import axios from 'axios';
import { Request, Response } from 'express';
import logger from '../../../service/WinstonLogger';
import app from '../../server';
import EnsureUserToken from '../middleware/EnsureUserToken';

export default class MovieController {
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        logger.info("TMBD routes start");

        app.post("/api/search-content", EnsureUserToken.validate, async (req: Request, res: Response) => {
            try {
                const { type, search } = req.body;
                
                const response = await axios.get(`https://api.themoviedb.org/3/search/${type}?query=${search}&language=pt-BR`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.TMDB_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });

                return res.status(200).json(response.data);
            } catch(e){
                return res.status(500).json({message: "Error creating movie"});
            }
        });
    }
}
