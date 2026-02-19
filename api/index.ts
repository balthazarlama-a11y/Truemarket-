import { type VercelRequest, type VercelResponse } from "@vercel/node";
import { createClerkClient } from "@clerk/express";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, ilike, or, sql, and } from "drizzle-orm";
import { companies, products, insertProductSchema } from "../shared/schema";
import type { Company, Product, InsertProduct } from "../shared/schema";

// ── DB ────────────────────────────────────────────────────────
let db: ReturnType<typeof drizzle> | null = null;
function getDb() {
    if (!db) {
        const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
        db = drizzle(pool);
    }
    return db;
}

// ── Clerk ─────────────────────────────────────────────────────
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });

async function getClerkUserId(req: VercelRequest): Promise<string | null> {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return null;
    const token = authHeader.slice(7);
    try {
        const decoded = await clerkClient.verifyToken(token);
        return decoded.sub;
    } catch {
        return null;
    }
}

async function requireBusinessUser(req: VercelRequest): Promise<{ userId: string } | { error: string; status: number }> {
    const userId = await getClerkUserId(req);
    if (!userId) return { error: "No autenticado", status: 401 };
    try {
        const user = await clerkClient.users.getUser(userId);
        if ((user.publicMetadata as any)?.role !== "business") {
            return { error: "Requiere rol de empresa", status: 403 };
        }
        return { userId };
    } catch {
        return { error: "Error verificando usuario", status: 401 };
    }
}

// ── Storage helpers ───────────────────────────────────────────
async function getCompanyByUserId(userId: string): Promise<Company | undefined> {
    const result = await getDb().select().from(companies).where(eq(companies.userId, userId)).limit(1);
    return result[0];
}

// ── Handler ───────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") return res.status(200).end();

    const url = req.url || "";
    const path = url.split("?")[0].replace(/^\/api/, "");
    const method = req.method || "GET";

    try {
        // ── GET /companies ───────────────────────────────────
        if (method === "GET" && path === "/companies") {
            const allCompanies = await getDb().select().from(companies);
            return res.json(allCompanies);
        }

        // ── GET /companies/:id ───────────────────────────────
        if (method === "GET" && path.match(/^\/companies\/[^/]+$/)) {
            const id = path.split("/")[2];
            const result = await getDb().select().from(companies).where(eq(companies.id, id)).limit(1);
            const company = result[0];
            if (!company) return res.status(404).json({ message: "Empresa no encontrada" });
            await getDb().update(companies).set({ viewCount: sql`COALESCE(${companies.viewCount}, 0) + 1` }).where(eq(companies.id, id));
            const companyProducts = await getDb().select().from(products).where(eq(products.companyId, id));
            return res.json({ company: { ...company, viewCount: (company.viewCount || 0) + 1 }, products: companyProducts });
        }

        // ── POST /register-company ───────────────────────────
        if (method === "POST" && path === "/register-company") {
            const userId = await getClerkUserId(req);
            if (!userId) return res.status(401).json({ message: "No autenticado" });
            const existing = await getCompanyByUserId(userId);
            if (existing) return res.status(409).json({ message: "Ya tienes una empresa registrada" });
            const { companyName, rut, description, category, companyType, phone, address } = req.body;
            if (!companyName || !rut || !category || !companyType || !phone) {
                return res.status(400).json({ message: "Faltan campos requeridos" });
            }
            const result = await getDb().insert(companies).values({
                userId, companyName, rut, description: description || null,
                category, companyType, phone, address: address || null,
            }).returning();
            await clerkClient.users.updateUser(userId, { publicMetadata: { role: "business" } });
            return res.status(201).json(result[0]);
        }

        // ── GET /my/company ──────────────────────────────────
        if (method === "GET" && path === "/my/company") {
            const auth = await requireBusinessUser(req);
            if ("error" in auth) return res.status(auth.status).json({ message: auth.error });
            const company = await getCompanyByUserId(auth.userId);
            if (!company) return res.status(404).json({ message: "No tienes empresa registrada" });
            return res.json(company);
        }

        // ── GET /my/products (business - company products) ───
        if (method === "GET" && path === "/my/products") {
            const auth = await requireBusinessUser(req);
            if ("error" in auth) return res.status(auth.status).json({ message: auth.error });
            const company = await getCompanyByUserId(auth.userId);
            if (!company) return res.status(404).json({ message: "No tienes empresa registrada" });
            const myProducts = await getDb().select().from(products).where(eq(products.companyId, company.id));
            return res.json(myProducts);
        }

        // ── POST /my/products (business - create company product) ──
        if (method === "POST" && path === "/my/products") {
            const auth = await requireBusinessUser(req);
            if ("error" in auth) return res.status(auth.status).json({ message: auth.error });
            const parsed = insertProductSchema.safeParse(req.body);
            if (!parsed.success) return res.status(400).json({ message: "Datos inválidos", errors: parsed.error.flatten().fieldErrors });
            const company = await getCompanyByUserId(auth.userId);
            if (!company) return res.status(404).json({ message: "No tienes empresa registrada" });
            const result = await getDb().insert(products).values({
                companyId: company.id, userId: auth.userId, name: parsed.data.name,
                description: parsed.data.description || null, price: parsed.data.price || null,
                category: parsed.data.category || null, imageUrl: parsed.data.imageUrl || null,
                status: "active", isVerified: true,
            }).returning();
            return res.status(201).json(result[0]);
        }

        // ── PUT /my/products/:id (business) ──────────────────
        if (method === "PUT" && path.match(/^\/my\/products\/[^/]+$/)) {
            const auth = await requireBusinessUser(req);
            if ("error" in auth) return res.status(auth.status).json({ message: auth.error });
            const productId = path.split("/")[3];
            const parsed = insertProductSchema.partial().safeParse(req.body);
            if (!parsed.success) return res.status(400).json({ message: "Datos inválidos" });
            const company = await getCompanyByUserId(auth.userId);
            if (!company) return res.status(404).json({ message: "No tienes empresa registrada" });
            const existing = await getDb().select().from(products).where(eq(products.id, productId)).limit(1);
            if (!existing[0] || existing[0].companyId !== company.id) return res.status(404).json({ message: "Producto no encontrado" });
            const result = await getDb().update(products).set({
                ...(parsed.data.name !== undefined && { name: parsed.data.name }),
                ...(parsed.data.description !== undefined && { description: parsed.data.description || null }),
                ...(parsed.data.price !== undefined && { price: parsed.data.price || null }),
                ...(parsed.data.category !== undefined && { category: parsed.data.category || null }),
                ...(parsed.data.imageUrl !== undefined && { imageUrl: parsed.data.imageUrl || null }),
            }).where(eq(products.id, productId)).returning();
            return res.json(result[0]);
        }

        // ── DELETE /my/products/:id (business) ────────────────
        if (method === "DELETE" && path.match(/^\/my\/products\/[^/]+$/)) {
            const auth = await requireBusinessUser(req);
            if ("error" in auth) return res.status(auth.status).json({ message: auth.error });
            const productId = path.split("/")[3];
            const company = await getCompanyByUserId(auth.userId);
            if (!company) return res.status(404).json({ message: "No tienes empresa registrada" });
            const existing = await getDb().select().from(products).where(eq(products.id, productId)).limit(1);
            if (!existing[0] || existing[0].companyId !== company.id) return res.status(404).json({ message: "Producto no encontrado" });
            await getDb().delete(products).where(eq(products.id, productId));
            return res.json({ message: "Producto eliminado" });
        }

        // ═══════════════════════════════════════════════════════
        // ── USER PRODUCT ENDPOINTS (any authenticated user) ───
        // ═══════════════════════════════════════════════════════

        // ── POST /products (any authenticated user) ──────────
        if (method === "POST" && path === "/products") {
            const userId = await getClerkUserId(req);
            if (!userId) return res.status(401).json({ message: "No autenticado" });
            const parsed = insertProductSchema.safeParse(req.body);
            if (!parsed.success) return res.status(400).json({ message: "Datos inválidos", errors: parsed.error.flatten().fieldErrors });

            // Check if user has a company → verified product
            const company = await getCompanyByUserId(userId);
            const result = await getDb().insert(products).values({
                companyId: company?.id || null,
                userId,
                name: parsed.data.name,
                description: parsed.data.description || null,
                price: parsed.data.price || null,
                category: parsed.data.category || null,
                imageUrl: parsed.data.imageUrl || null,
                status: "active",
                isVerified: !!company,
            }).returning();
            return res.status(201).json(result[0]);
        }

        // ── GET /user/products (user's own products) ─────────
        if (method === "GET" && path === "/user/products") {
            const userId = await getClerkUserId(req);
            if (!userId) return res.status(401).json({ message: "No autenticado" });
            const userProducts = await getDb().select().from(products).where(eq(products.userId, userId));
            return res.json(userProducts);
        }

        // ── PUT /user/products/:id ───────────────────────────
        if (method === "PUT" && path.match(/^\/user\/products\/[^/]+$/)) {
            const userId = await getClerkUserId(req);
            if (!userId) return res.status(401).json({ message: "No autenticado" });
            const productId = path.split("/")[3];
            const parsed = insertProductSchema.partial().safeParse(req.body);
            if (!parsed.success) return res.status(400).json({ message: "Datos inválidos" });
            const existing = await getDb().select().from(products).where(eq(products.id, productId)).limit(1);
            if (!existing[0] || existing[0].userId !== userId) return res.status(404).json({ message: "Producto no encontrado" });
            const result = await getDb().update(products).set({
                ...(parsed.data.name !== undefined && { name: parsed.data.name }),
                ...(parsed.data.description !== undefined && { description: parsed.data.description || null }),
                ...(parsed.data.price !== undefined && { price: parsed.data.price || null }),
                ...(parsed.data.category !== undefined && { category: parsed.data.category || null }),
                ...(parsed.data.imageUrl !== undefined && { imageUrl: parsed.data.imageUrl || null }),
            }).where(eq(products.id, productId)).returning();
            return res.json(result[0]);
        }

        // ── DELETE /user/products/:id ─────────────────────────
        if (method === "DELETE" && path.match(/^\/user\/products\/[^/]+$/)) {
            const userId = await getClerkUserId(req);
            if (!userId) return res.status(401).json({ message: "No autenticado" });
            const productId = path.split("/")[3];
            const existing = await getDb().select().from(products).where(eq(products.id, productId)).limit(1);
            if (!existing[0] || existing[0].userId !== userId) return res.status(404).json({ message: "Producto no encontrado" });
            await getDb().delete(products).where(eq(products.id, productId));
            return res.json({ message: "Producto eliminado" });
        }

        // ── GET /products (all products, public) ─────────────
        if (method === "GET" && path === "/products") {
            const allProducts = await getDb()
                .select({
                    id: products.id, companyId: products.companyId, userId: products.userId,
                    name: products.name, description: products.description, price: products.price,
                    category: products.category, imageUrl: products.imageUrl, status: products.status,
                    isVerified: products.isVerified, createdAt: products.createdAt,
                    companyName: companies.companyName,
                })
                .from(products)
                .leftJoin(companies, eq(products.companyId, companies.id));
            return res.json(allProducts.map(p => ({ ...p, companyName: p.companyName ?? undefined })));
        }

        // ── GET /search ──────────────────────────────────────
        if (method === "GET" && path === "/search") {
            const q = (req.query.q as string) || "";
            if (!q || q.length < 2) return res.json({ companies: [], products: [] });
            const pattern = `%${q}%`;
            const matchedCompanies = await getDb().select().from(companies).where(or(ilike(companies.companyName, pattern), ilike(companies.category, pattern)));
            const matchedProducts = await getDb()
                .select({
                    id: products.id, companyId: products.companyId, userId: products.userId,
                    name: products.name, description: products.description, price: products.price,
                    category: products.category, imageUrl: products.imageUrl, status: products.status,
                    isVerified: products.isVerified, createdAt: products.createdAt,
                    companyName: companies.companyName,
                })
                .from(products).leftJoin(companies, eq(products.companyId, companies.id))
                .where(or(ilike(products.name, pattern), ilike(products.category, pattern), ilike(companies.companyName, pattern)));
            return res.json({ companies: matchedCompanies, products: matchedProducts.map(p => ({ ...p, companyName: p.companyName ?? undefined })) });
        }

        return res.status(404).json({ message: "Ruta no encontrada" });
    } catch (err: any) {
        console.error("API Error:", err);
        return res.status(500).json({ message: err.message || "Internal Server Error" });
    }
}
