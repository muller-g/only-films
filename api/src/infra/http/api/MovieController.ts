import { Request, Response } from 'express';
import { createMulter } from '../../../service/multer';
import logger from '../../../service/WinstonLogger';
import app from '../../server';
import EnsureUserToken from '../middleware/EnsureUserToken';
import ImageFileService from '../service/ImageFileService';
import MovieService from '../service/MovieService';

export default class MovieController {
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        logger.info("Movie routes start");

        app.post("/api/create-movie", EnsureUserToken.validate, async (req: Request, res: Response) => {
            try {
                const uploadMiddleware = createMulter((req: any) => {
                    const movieName = req.body.title.normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-zA-Z0-9 ]/g, '')
                    .trim()
                    .replace(/\s+/g, '_')
                    .toLowerCase();

                    return `uploads/movies/${movieName}`;
                }).single('coverPhoto');
                
                uploadMiddleware(req, res, async (err) => {
                    let reqFile: any = req.file;

                    let imgFile = {
                        name: reqFile.filename,
                        path: reqFile.destination,
                        originalName: reqFile.originalname
                    };

                    let createdCoverFile = await ImageFileService.create(imgFile);

                    await MovieService.create({
                        title: req.body.title,
                        category: req.body.category,
                        releaseDate: req.body.releaseDate,
                        coverId: createdCoverFile.id
                    });
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
