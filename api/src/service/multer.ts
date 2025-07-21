import multer, { StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';

export const createMulter = (getFolderPath: (req: Express.Request) => string) => {
  const storage: StorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      const folderPath = getFolderPath(req);
      
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      cb(null, folderPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });

  return multer({ storage });
};
