"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../src/infra/server"));
const LoginController_1 = __importDefault(require("./infra/http/api/LoginController"));
const ReviewController_1 = __importDefault(require("./infra/http/api/ReviewController"));
const UserController_1 = __importDefault(require("./infra/http/api/UserController"));
const WinstonLogger_1 = __importDefault(require("./service/WinstonLogger"));
new UserController_1.default();
new LoginController_1.default();
new ReviewController_1.default();
server_1.default.listen(3001, () => {
    WinstonLogger_1.default.info(`Express is listening at http://localhost:3001`);
});
