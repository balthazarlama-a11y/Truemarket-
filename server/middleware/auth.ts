import { type Request, type Response, type NextFunction } from "express";
import { getAuth } from "@clerk/express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const { userId } = getAuth(req);
    if (!userId) {
        return res.status(401).json({ message: "No autenticado" });
    }
    next();
}

export function requireRole(role: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        const { sessionClaims } = getAuth(req);
        // Adjust based on how roles are stored in metadata
        const userRole = (sessionClaims?.publicMetadata as any)?.role;
        if (userRole !== role) {
            return res.status(403).json({ message: "No autorizado" });
        }
        next();
    };
}
