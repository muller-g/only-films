"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const server_1 = __importDefault(require("../../server"));
const LoginService_1 = __importDefault(require("../service/LoginService"));
const WinstonLogger_1 = __importDefault(require("../../../service/WinstonLogger"));
dotenv_1.default.config();
class LoginController {
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        WinstonLogger_1.default.info("Login routes start");
        server_1.default.post("/api/login", async (req, res) => {
            try {
                const { email, password } = req.body;
                const user = await LoginService_1.default.login(email, password);
                if (!user || typeof user === "string") {
                    res.status(403).send("Unauthorized");
                    return;
                }
                const token = jsonwebtoken_1.default.sign({
                    id: user.id,
                    name: user.name,
                    email: user.email
                }, process.env.JWT_SECRET || '');
                return res.status(200).json({
                    user: user,
                    token: token
                });
            }
            catch (e) {
                return res.status(500).json("Error");
            }
        });
    }
}
exports.default = LoginController;
