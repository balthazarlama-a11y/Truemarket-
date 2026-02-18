import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { scryptSync, randomBytes, timingSafeEqual } from "crypto";
import type { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import type { User } from "@shared/schema";

// Extend express-session types
declare module "express-session" {
    interface SessionData {
        passport: { user: string };
    }
}

declare global {
    namespace Express {
        interface User extends Omit<import("@shared/schema").User, "password"> { }
    }
}

// ── Password hashing ────────────────────────────────────────
export function hashPassword(password: string): string {
    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(password, salt, 64).toString("hex");
    return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
    const [salt, hash] = stored.split(":");
    const hashBuffer = Buffer.from(hash, "hex");
    const derivedBuffer = scryptSync(password, salt, 64);
    return timingSafeEqual(hashBuffer, derivedBuffer);
}

// ── Passport + Session Setup ────────────────────────────────
export function setupAuth(app: Express) {
    // Session config
    app.use(
        session({
            secret: process.env.SESSION_SECRET || "truemarket-secret-key-change-in-prod",
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
            },
        })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    // Local strategy using email
    passport.use(
        new LocalStrategy(
            { usernameField: "email", passwordField: "password" },
            async (email, password, done) => {
                try {
                    const user = await storage.getUserByEmail(email);
                    if (!user) {
                        return done(null, false, { message: "Email o contraseña incorrectos" });
                    }
                    if (!verifyPassword(password, user.password)) {
                        return done(null, false, { message: "Email o contraseña incorrectos" });
                    }
                    return done(null, user);
                } catch (err) {
                    return done(err);
                }
            }
        )
    );

    passport.serializeUser((user: Express.User, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id: string, done) => {
        try {
            const user = await storage.getUser(id);
            if (!user) {
                return done(null, false);
            }
            // Don't send password to client
            const { password, ...userWithoutPassword } = user;
            done(null, userWithoutPassword as Express.User);
        } catch (err) {
            done(err);
        }
    });
}

// ── Auth middleware ──────────────────────────────────────────
export function requireAuth(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: "No autenticado" });
}

export function requireRole(role: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "No autenticado" });
        }
        if ((req.user as any).role !== role) {
            return res.status(403).json({ message: "No autorizado" });
        }
        next();
    };
}
