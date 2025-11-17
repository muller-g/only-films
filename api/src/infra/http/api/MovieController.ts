import { Request, Response } from 'express';
import logger from '../../../service/WinstonLogger';
import app from '../../server';
import EnsureUserToken from '../middleware/EnsureUserToken';
import MovieService from '../service/MovieService';
import MovieGenreService from '../service/MovieGenreService';
import TvGenreService from '../service/TvGenreService';

export default class MovieController {
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        logger.info("Movie routes start");

        app.post("/api/create-movie", EnsureUserToken.validate, async (req: any, res: Response) => {
            try {
                let { image, type, category, title, releaseDate, id } = req.body;

                let movie = await MovieService.getByTmdbId(id);

                if(movie){
                    return res.status(200).json({message: "Movie created successfully"});
                }

                let movieCategory = await MovieGenreService.getByTmdbId(category);
                
                if(type === 'tv'){
                    movieCategory = await TvGenreService.getByTmdbId(category);
                }

                await MovieService.create({
                    title: title,
                    category: movieCategory?.name,
                    releaseDate: releaseDate,
                    image: image,
                    type: type,
                    tmdb_id: id
                });

                return res.status(200).json({message: "Movie created successfully"});
            } catch(e){
                return res.status(500).json({message: "Error creating movie"});
            }
        });

        app.post("/api/movie-similars", EnsureUserToken.validate, async (req: Request, res: Response) => {
            try {
                const category = req.body.category;

                const movies = await MovieService.getSimilarMovies(category);

                return res.status(200).json(movies);
            } catch(e){
                return res.status(500).json("Error");
            } 
        });

        app.get("/api/movie/:id", EnsureUserToken.validate, async (req: Request, res: Response) => {
            try {
                const movieId = req.params.id;

                const reviews = await MovieService.getById(movieId);

                return res.status(200).json(reviews);
            } catch(e){
                return res.status(500).json("Error");
            } 
        });

        app.get("/api/all-movies", EnsureUserToken.validate, async (req: Request, res: Response) => {
            try {
                const movies = await MovieService.getAllMovies();

                return res.status(200).json(movies);
            } catch(e){
                return res.status(500).json("Error");
            } 
        });
    }
}
