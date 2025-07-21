"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
class User {
    constructor(id, name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.id = id;
    }
    static async createUser(name, email, password, id) {
        let crypted = await bcrypt_1.default.hash(password, 8);
        return new User(id, name, email, crypted);
    }
}
exports.default = User;
