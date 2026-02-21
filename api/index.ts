import express from "express";
import { registerRoutes } from "../server/routes";

const app = express();

app.use((req, res, next) => {
    // Vercel's @vercel/node runtime pre-parses the request body and consumes
    // the stream. If req.body is already set, skip Express's json parser to
    // avoid reading from an empty/consumed stream.
    if (req.body !== undefined) {
        return next();
    }
    express.json({ limit: '50mb' })(req, res, next);
});

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
        app(req, res);
    } catch (error) {
        console.error("Vercel Serverless Init Error:", error);
        res.status(500).json({ message: "Error interno del servidor", error: String(error) });
    }
}
