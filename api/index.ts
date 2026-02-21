import { createServer } from "http";
import express from "express";
import { registerRoutes } from "../server/routes";

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

let isInitialized = false;

async function init() {
    if (!isInitialized) {
        await registerRoutes(app);
        isInitialized = true;
    }
}

export default async function handler(req: any, res: any) {
    try {
        await init();
        return app(req, res);
    } catch (error) {
        console.error("Vercel Serverless Init Error:", error);
        res.status(500).json({ message: "Houston, tenemos un problema interno", error: String(error) });
    }
}
