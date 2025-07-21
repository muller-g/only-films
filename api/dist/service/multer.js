"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMulter = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const createMulter = (getFolderPath) => {
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            const folderPath = getFolderPath(req);
            if (!fs_1.default.existsSync(folderPath)) {
                fs_1.default.mkdirSync(folderPath, { recursive: true });
            }
            cb(null, folderPath);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
        }
    });
    return (0, multer_1.default)({ storage });
};
exports.createMulter = createMulter;
