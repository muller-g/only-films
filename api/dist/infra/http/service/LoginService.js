"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../../database/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    static async login(email, password) {
        try {
            const user = await client_1.prisma.user.findFirst({
                where: {
                    email: email
                }
            });
            if (!await bcrypt_1.default.compare(password, user.password)) {
                return undefined;
            }
            return user;
        }
        catch (e) {
            return e.message;
        }
    }
}
exports.default = UserService;
