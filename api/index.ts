import express from "express";
import { clerkMiddleware } from "@clerk/express";
import { registerRoutes } from "../server/routes";

const app = express();

// Smart body parsing: Vercel pre-parses JSON and consumes the stream.
// If req.body is already an object, skip express.json() to avoid reading
// the consumed stream (which would fail silently or throw).
app.use((req: any, _res: any, next: any) => {
  if (req.body !== undefined && req.body !== null && typeof req.body === "object") {
    return next();
  }
  express.json({ limit: "50mb" })(req, _res, (err: any) => {
    if (err) {
      console.warn("[Vercel] body-parse fallback error:", err.message);
    }
    next();
  });
});
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

// Clerk auth — MUST run before routes so getAuth() works
app.use(clerkMiddleware());

let isInitialized = false;

async function init() {
  if (!isInitialized) {
    await registerRoutes(app);
    app.use((err: any, _req: any, res: any, _next: any) => {
      console.error("[Vercel] unhandled error:", err?.stack ?? err);
      if (!res.headersSent) {
        res.status(500).json({ message: "Error interno del servidor" });
      }
    });
    isInitialized = true;
  }
}

export default async function handler(req: any, res: any) {
  try {
    await init();
    app(req, res);
  } catch (error: any) {
    console.error("[Vercel] handler error:", error?.stack ?? error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}
