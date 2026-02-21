import { type Request, type Response, type NextFunction } from "express";
import { getAuth } from "@clerk/express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ message: "No autenticado" });
        }
        next();
    } catch (err) {
        console.error("requireAuth error:", err);
        if (!res.headersSent) res.status(401).json({ message: "No autenticado" });
    }
}

export function requireRole(role: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const { sessionClaims } = getAuth(req);
            const userRole = (sessionClaims?.publicMetadata as any)?.role;
            if (userRole !== role) {
                return res.status(403).json({ message: "No autorizado" });
            }
            next();
        } catch (err) {
            console.error("requireRole error:", err);
            if (!res.headersSent) res.status(403).json({ message: "No autorizado" });
        }
    };
}
