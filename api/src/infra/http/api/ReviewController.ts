import { Request, Response } from 'express';
import { createMulter } from '../../../service/multer';
import logger from '../../../service/WinstonLogger';
import app from '../../server';
import EnsureUserToken from '../middleware/EnsureUserToken';
import ImageFileService from '../service/ImageFileService';
import MovieService from '../service/MovieService';
import ReviewService from '../service/ReviewService';

export default class ReviewController {
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        logger.info("Review routes start");

        app.post("/api/create-review", async (req: Request, res: Response) => {
            try {

                if(req.body.movieId && req.body.movieId !== ''){
                    let existsMovie = await MovieService.getById(req.body.movieId);

                    let review = {
                        userId: req.body.userId,
                        movieId: existsMovie.id,
                        review: req.body.review,
                        rate: parseInt(req.body.rate)
                    };
                    
                    await ReviewService.create(review);

                } else {
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

                        let createdMovie = await MovieService.create({
                            title: req.body.title,
                            category: req.body.category,
                            releaseDate: req.body.releaseDate,
                            coverId: createdCoverFile.id
                        });

                        await ReviewService.create({
                            userId: req.body.userId,
                            movieId: createdMovie.id,
                            review: req.body.review,
                            rate: parseInt(req.body.rate)
                        });
                    });
                }

                return res.status(200).json({message: "Review created successfully"});
            } catch(e){
                return res.status(500).json({message: "Error creating review"});
            }
        });

        app.get("/api/review/:id", EnsureUserToken.validate, async (req: Request, res: Response) => {
            try {
                const movieId = req.params.id;

                const reviews = await ReviewService.getReview(movieId);

                return res.status(200).json(reviews);
            } catch(e){
                return res.status(500).json("Error");
            } 
        });

        app.get("/api/all-reviews", EnsureUserToken.validate, async (req: Request, res: Response) => {
            try {

                const reviews = await ReviewService.getAllReviews();

                return res.status(200).json(reviews);
            } catch(e){
                return res.status(500).json("Error");
            } 
        });

        app.get("/api/user-reviews/:userId", EnsureUserToken.validate, async (req: Request, res: Response) => {
            try {
                const userId = req.params.userId;

                const reviews = await ReviewService.getReviewsByUserId(userId);

                return res.status(200).json(reviews);
            } catch(e){
                return res.status(500).json("Error");
            } 
        });

        app.get("/api/search-movies", EnsureUserToken.validate, async (req: Request, res: Response) => {
            try {
                const title = req.query.title as string;

                const movies = await ReviewService.getMovieByTitle(title);

                return res.status(200).json(movies);
            } catch(e){
                return res.status(500).json("Error");
            } 
        });
    }
}
