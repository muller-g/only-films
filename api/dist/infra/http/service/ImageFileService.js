"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../../database/client");
class ImageFileService {
    static async create(imageFile) {
        try {
            return await client_1.prisma.imageFile.create({
                data: {
                    name: imageFile.name,
                    path: imageFile.path,
                    original_name: imageFile.originalName,
                }
            });
        }
        catch (e) {
            return e.message;
        }
    }
}
exports.default = ImageFileService;
