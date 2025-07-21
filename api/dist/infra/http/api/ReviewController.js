"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = require("../../../service/multer");
const WinstonLogger_1 = __importDefault(require("../../../service/WinstonLogger"));
const server_1 = __importDefault(require("../../server"));
const EnsureUserToken_1 = __importDefault(require("../middleware/EnsureUserToken"));
const ImageFileService_1 = __importDefault(require("../service/ImageFileService"));
const MovieService_1 = __importDefault(require("../service/MovieService"));
const ReviewService_1 = __importDefault(require("../service/ReviewService"));
class ReviewController {
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        WinstonLogger_1.default.info("Review routes start");
        server_1.default.post("/api/create-review", async (req, res) => {
            try {
                if (req.body.movieId && req.body.movieId !== '') {
                    let existsMovie = await MovieService_1.default.getById(req.body.movieId);
                    let review = {
                        userId: req.body.userId,
                        movieId: existsMovie.id,
                        review: req.body.review,
                        rate: parseInt(req.body.rate)
                    };
                    await ReviewService_1.default.create(review);
                }
                else {
                    const uploadMiddleware = (0, multer_1.createMulter)((req) => {
                        const movieName = req.body.title.normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, '')
                            .replace(/[^a-zA-Z0-9 ]/g, '')
                            .trim()
                            .replace(/\s+/g, '_')
                            .toLowerCase();
                        return `uploads/movies/${movieName}`;
                    }).single('coverPhoto');
                    uploadMiddleware(req, res, async (err) => {
                        let reqFile = req.file;
                        let imgFile = {
                            name: reqFile.filename,
                            path: reqFile.destination,
                            originalName: reqFile.originalname
                        };
                        let createdCoverFile = await ImageFileService_1.default.create(imgFile);
                        let createdMovie = await MovieService_1.default.create({
                            title: req.body.title,
                            category: req.body.category,
                            releaseDate: req.body.releaseDate,
                            coverId: createdCoverFile.id
                        });
                        await ReviewService_1.default.create({
                            userId: req.body.userId,
                            movieId: createdMovie.id,
                            review: req.body.review,
                            rate: parseInt(req.body.rate)
                        });
                    });
                }
                return res.status(200).json({ message: "Review created successfully" });
            }
            catch (e) {
                return res.status(500).json({ message: "Error creating review" });
            }
        });
        server_1.default.get("/api/review/:id", EnsureUserToken_1.default.validate, async (req, res) => {
            try {
                const movieId = req.params.id;
                const reviews = await ReviewService_1.default.getReview(movieId);
                return res.status(200).json(reviews);
            }
            catch (e) {
                return res.status(500).json("Error");
            }
        });
        server_1.default.get("/api/all-reviews", EnsureUserToken_1.default.validate, async (req, res) => {
            try {
                const reviews = await ReviewService_1.default.getAllReviews();
                return res.status(200).json(reviews);
            }
            catch (e) {
                return res.status(500).json("Error");
            }
        });
        server_1.default.get("/api/user-reviews/:userId", EnsureUserToken_1.default.validate, async (req, res) => {
            try {
                const userId = req.params.userId;
                const reviews = await ReviewService_1.default.getReviewsByUserId(userId);
                return res.status(200).json(reviews);
            }
            catch (e) {
                return res.status(500).json("Error");
            }
        });
        server_1.default.get("/api/search-movies", EnsureUserToken_1.default.validate, async (req, res) => {
            try {
                const title = req.query.title;
                const movies = await ReviewService_1.default.getMovieByTitle(title);
                return res.status(200).json(movies);
            }
            catch (e) {
                return res.status(500).json("Error");
            }
        });
    }
}
exports.default = ReviewController;
