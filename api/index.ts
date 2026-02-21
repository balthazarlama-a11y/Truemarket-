import express from "express";
import { registerRoutes } from "../server/routes";

const app = express();

// Always parse JSON body so we have req.body (Vercel may or may not set it when using Express)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

let isInitialized = false;

async function init() {
    if (!isInitialized) {
        await registerRoutes(app);
        // Catch any unhandled errors (e.g. from express.json() when body is invalid) and return JSON
        app.use((err: any, _req: any, res: any, _next: any) => {
            console.error("API error handler:", err);
            if (!res.headersSent) res.status(500).json({ message: err?.message || "Error interno del servidor" });
        });
        isInitialized = true;
    }
}

export default async function handler(req: any, res: any) {
    const sendJsonError = (status: number, message: string) => {
        try {
            if (!res.headersSent) res.status(status).json({ message });
        } catch (_) {}
    };
    try {
        await init();
        app(req, res);
    } catch (error) {
        console.error("Vercel Serverless Init Error:", error);
        sendJsonError(500, "Error interno del servidor");
    }
}
