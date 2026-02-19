import type { Express } from "express";
import type { Server } from "http";
import { getAuth, requireAuth } from "@clerk/express";
import { createClerkClient } from "@clerk/express";
import { storage } from "./storage";
import { insertProductSchema } from "@shared/schema";

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });

// Middleware: require business role via Clerk publicMetadata
function requireBusiness() {
  return async (req: any, res: any, next: any) => {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "No autenticado" });
    try {
      const user = await clerkClient.users.getUser(userId);
      if ((user.publicMetadata as any)?.role !== "business") {
        return res.status(403).json({ message: "Requiere rol de empresa" });
      }
      next();
    } catch {
      return res.status(401).json({ message: "Error verificando usuario" });
    }
  };
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {

  // ── Register Company ────────────────────────────────────────
  app.post("/api/register-company", requireAuth(), async (req: any, res, next) => {
    try {
      const { userId } = getAuth(req);
      if (!userId) return res.status(401).json({ message: "No autenticado" });
      const existing = await storage.getCompanyByUserId(userId);
      if (existing) return res.status(409).json({ message: "Ya tienes una empresa registrada" });
      const { companyName, rut, description, category, companyType, phone, address } = req.body;
      if (!companyName || !rut || !category || !companyType || !phone) {
        return res.status(400).json({ message: "Faltan campos requeridos" });
      }
      const company = await storage.createCompany(userId, { companyName, rut, description, category, companyType, phone, address });
      await clerkClient.users.updateUser(userId, { publicMetadata: { role: "business" } });
      res.status(201).json(company);
    } catch (err) { next(err); }
  });

  // ── Companies (public) ─────────────────────────────────────
  app.get("/api/companies", async (_req, res, next) => {
    try {
      res.json(await storage.getAllCompanies());
    } catch (err) { next(err); }
  });

  app.get("/api/companies/:id", async (req, res, next) => {
    try {
      const company = await storage.getCompanyById(req.params.id);
      if (!company) return res.status(404).json({ message: "Empresa no encontrada" });
      await storage.incrementCompanyViews(company.id);
      const companyProducts = await storage.getProductsByCompanyId(company.id);
      res.json({ company: { ...company, viewCount: (company.viewCount || 0) + 1 }, products: companyProducts });
    } catch (err) { next(err); }
  });

  // ── My Company (business) ──────────────────────────────────
  app.get("/api/my/company", requireAuth(), requireBusiness(), async (req: any, res, next) => {
    try {
      const { userId } = getAuth(req);
      const company = await storage.getCompanyByUserId(userId!);
      if (!company) return res.status(404).json({ message: "No tienes empresa registrada" });
      res.json(company);
    } catch (err) { next(err); }
  });

  // ── My Products (business) ─────────────────────────────────
  app.get("/api/my/products", requireAuth(), requireBusiness(), async (req: any, res, next) => {
    try {
      const { userId } = getAuth(req);
      const company = await storage.getCompanyByUserId(userId!);
      if (!company) return res.status(404).json({ message: "No tienes empresa registrada" });
      res.json(await storage.getProductsByCompanyId(company.id));
    } catch (err) { next(err); }
  });

  app.post("/api/my/products", requireAuth(), requireBusiness(), async (req: any, res, next) => {
    try {
      const parsed = insertProductSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Datos inválidos", errors: parsed.error.flatten().fieldErrors });
      const { userId } = getAuth(req);
      const company = await storage.getCompanyByUserId(userId!);
      if (!company) return res.status(404).json({ message: "No tienes empresa registrada" });
      const product = await storage.createProduct(company.id, userId!, parsed.data, true);
      res.status(201).json(product);
    } catch (err) { next(err); }
  });

  app.put("/api/my/products/:id", requireAuth(), requireBusiness(), async (req: any, res, next) => {
    try {
      const parsed = insertProductSchema.partial().safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Datos inválidos" });
      const { userId } = getAuth(req);
      const company = await storage.getCompanyByUserId(userId!);
      if (!company) return res.status(404).json({ message: "No tienes empresa registrada" });
      const updated = await storage.updateProduct(req.params.id, company.id, parsed.data);
      if (!updated) return res.status(404).json({ message: "Producto no encontrado" });
      res.json(updated);
    } catch (err) { next(err); }
  });

  app.delete("/api/my/products/:id", requireAuth(), requireBusiness(), async (req: any, res, next) => {
    try {
      const { userId } = getAuth(req);
      const company = await storage.getCompanyByUserId(userId!);
      if (!company) return res.status(404).json({ message: "No tienes empresa registrada" });
      const deleted = await storage.deleteProduct(req.params.id, company.id);
      if (!deleted) return res.status(404).json({ message: "Producto no encontrado" });
      res.json({ message: "Producto eliminado" });
    } catch (err) { next(err); }
  });

  // ═══════════════════════════════════════════════════════════
  // ── USER PRODUCT ENDPOINTS (any authenticated user) ────────
  // ═══════════════════════════════════════════════════════════

  // POST /api/products — any authenticated user
  app.post("/api/products", requireAuth(), async (req: any, res, next) => {
    try {
      const { userId } = getAuth(req);
      if (!userId) return res.status(401).json({ message: "No autenticado" });
      const parsed = insertProductSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Datos inválidos", errors: parsed.error.flatten().fieldErrors });
      const company = await storage.getCompanyByUserId(userId);
      const product = await storage.createProduct(company?.id || null, userId, parsed.data, !!company);
      res.status(201).json(product);
    } catch (err) { next(err); }
  });

  // GET /api/products — all products (public)
  app.get("/api/products", async (_req, res, next) => {
    try {
      res.json(await storage.getAllProducts());
    } catch (err) { next(err); }
  });

  // GET /api/user/products — user's own products
  app.get("/api/user/products", requireAuth(), async (req: any, res, next) => {
    try {
      const { userId } = getAuth(req);
      if (!userId) return res.status(401).json({ message: "No autenticado" });
      res.json(await storage.getProductsByUserId(userId));
    } catch (err) { next(err); }
  });

  // PUT /api/user/products/:id
  app.put("/api/user/products/:id", requireAuth(), async (req: any, res, next) => {
    try {
      const { userId } = getAuth(req);
      if (!userId) return res.status(401).json({ message: "No autenticado" });
      const parsed = insertProductSchema.partial().safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Datos inválidos" });
      const updated = await storage.updateProductByUser(req.params.id, userId, parsed.data);
      if (!updated) return res.status(404).json({ message: "Producto no encontrado" });
      res.json(updated);
    } catch (err) { next(err); }
  });

  // DELETE /api/user/products/:id
  app.delete("/api/user/products/:id", requireAuth(), async (req: any, res, next) => {
    try {
      const { userId } = getAuth(req);
      if (!userId) return res.status(401).json({ message: "No autenticado" });
      const deleted = await storage.deleteProductByUser(req.params.id, userId);
      if (!deleted) return res.status(404).json({ message: "Producto no encontrado" });
      res.json({ message: "Producto eliminado" });
    } catch (err) { next(err); }
  });

  // ── Global Search ──────────────────────────────────────────
  app.get("/api/search", async (req, res, next) => {
    try {
      const q = (req.query.q as string) || "";
      if (!q || q.length < 2) return res.json({ companies: [], products: [] });
      res.json(await storage.searchGlobal(q));
    } catch (err) { next(err); }
  });

  return httpServer;
}
