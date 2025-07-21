import express, { Application } from 'express';
import cors from 'cors';

class Server {
    public app: Application;

    constructor() {
        this.app = express();
        this.config();
    }

    private config(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors({
            origin: '*'
        }));
        this.app.use('/uploads', express.static('uploads'));
    }
}

export default new Server().app;
