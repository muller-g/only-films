import { prisma } from "../../database/client";

export default class ImageFileService {
    static async create(imageFile: any){
        try {
            return await prisma.imageFile.create({
                data: {
                    name: imageFile.name,
                    path: imageFile.path,
                    original_name: imageFile.originalName,
                }
            });
        } catch (e: any){
            return e.message;
        }
    }
}