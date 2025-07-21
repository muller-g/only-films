"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../../server"));
const User_1 = __importDefault(require("../../../entity/User"));
const UserService_1 = __importDefault(require("../service/UserService"));
const EnsureUserToken_1 = __importDefault(require("../middleware/EnsureUserToken"));
const WinstonLogger_1 = __importDefault(require("../../../service/WinstonLogger"));
const multer_1 = require("../../../service/multer");
const ImageFileService_1 = __importDefault(require("../service/ImageFileService"));
class UserController {
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        WinstonLogger_1.default.info("User routes start");
        server_1.default.post("/api/register", async (req, res) => {
            try {
                const { name, email, password } = req.body;
                const user = await User_1.default.createUser(name, email, password);
                let createdUser = await UserService_1.default.create(user);
                if (typeof createdUser === "object" && createdUser.hasOwnProperty("created_at")) {
                    return res.status(200).json(createdUser);
                }
                return res.status(500).json(createdUser);
            }
            catch (e) {
                return res.status(500).json("Error");
            }
        });
        server_1.default.get("/api/profile/:id", EnsureUserToken_1.default.validate, async (req, res) => {
            try {
                const userId = req.params.id;
                let user = await UserService_1.default.getById(userId);
                if (!user) {
                    return res.status(404).json("User not found");
                }
                return res.status(200).json(user);
            }
            catch (e) {
                return res.status(500).json("Error");
            }
        });
        server_1.default.post("/api/profile-update", EnsureUserToken_1.default.validate, async (req, res) => {
            try {
                const uploadMiddleware = (0, multer_1.createMulter)((req) => {
                    return `uploads/users/${req.body.id}`;
                }).single('coverPhoto');
                uploadMiddleware(req, res, async (err) => {
                    let reqFile = req.file;
                    let imgFile = {
                        name: reqFile.filename,
                        path: reqFile.destination,
                        originalName: reqFile.originalname
                    };
                    let createdUserFile = await ImageFileService_1.default.create(imgFile);
                    const { name, id } = req.body;
                    let userCreated = await UserService_1.default.update({
                        name: name,
                        id: id,
                        profile_photo_id: createdUserFile.id
                    });
                });
                return res.status(200).json({ message: "Profile updated successfully" });
            }
            catch (e) {
                return res.status(500).json("Error");
            }
        });
        server_1.default.get("/api/users", EnsureUserToken_1.default.validate, async (req, res) => {
            try {
                return res.status(200).json(await UserService_1.default.get());
            }
            catch (e) {
                return res.status(500).json("Error");
            }
        });
    }
}
exports.default = UserController;
