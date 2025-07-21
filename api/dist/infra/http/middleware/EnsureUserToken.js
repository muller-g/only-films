"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class EnsureUserToken {
    static async validate(req, res, next) {
        if (!req.headers.authorization) {
            return res.status(401).json({ message: 'Token unsend' });
        }
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || '');
            req.token = token;
            req.context = {
                toke: token,
                user: decoded
            };
            next();
        }
        catch (e) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    }
    static async noAuth(req, res, next) {
        next();
    }
    ;
}
exports.default = EnsureUserToken;
