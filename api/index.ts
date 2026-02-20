
import { createServer } from "http";
import express from "express";
import { registerRoutes } from "../server/routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize routes asynchronously then export handler
// Note: Vercel serverless function needs to export a handler (req, res) => ...
// We can wrap the express app.

const serverPromise = registerRoutes(app);

export default async function handler(req: any, res: any) {
    // Ensure routes are registered before handling request
    await serverPromise;

    // Forward to express app
    app(req, res);
}
