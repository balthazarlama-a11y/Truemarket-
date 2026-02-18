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
    if (!userId) {
      return res.status(401).json({ message: "No autenticado" });
    }
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

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ── Register Company (authenticated user → creates company + assigns role) ──
  app.post("/api/register-company", requireAuth(), async (req: any, res, next) => {
    try {
      const { userId } = getAuth(req);
      if (!userId) return res.status(401).json({ message: "No autenticado" });

      // Check if user already has a company
      const existing = await storage.getCompanyByUserId(userId);
      if (existing) {
        return res.status(409).json({ message: "Ya tienes una empresa registrada" });
      }

      const { companyName, rut, description, category, companyType, phone, address } = req.body;

      if (!companyName || !rut || !category || !companyType || !phone) {
        return res.status(400).json({ message: "Faltan campos requeridos" });
      }

      // Create company in DB
      const company = await storage.createCompany(userId, {
        companyName,
        rut,
        description: description || undefined,
        category,
        companyType,
        phone,
        address: address || undefined,
      });

      // Set Clerk user publicMetadata role to 'business'
      await clerkClient.users.updateUser(userId, {
        publicMetadata: { role: "business" },
      });

      res.status(201).json(company);
    } catch (err) {
      next(err);
    }
  });

  // ── List All Companies (public) ─────────────────────────────
  app.get("/api/companies", async (_req, res, next) => {
    try {
      const allCompanies = await storage.getAllCompanies();
      res.json(allCompanies);
    } catch (err) {
      next(err);
    }
  });

  // ── Get Company Detail + Products (public) ──────────────────
  app.get("/api/companies/:id", async (req, res, next) => {
    try {
      const company = await storage.getCompanyById(req.params.id);
      if (!company) {
        return res.status(404).json({ message: "Empresa no encontrada" });
      }
      await storage.incrementCompanyViews(company.id);
      const companyProducts = await storage.getProductsByCompanyId(company.id);
      res.json({
        company: { ...company, viewCount: (company.viewCount || 0) + 1 },
        products: companyProducts,
      });
    } catch (err) {
      next(err);
    }
  });

  // ── My Company (seller) ─────────────────────────────────────
  app.get("/api/my/company", requireAuth(), requireBusiness(), async (req: any, res, next) => {
    try {
      const { userId } = getAuth(req);
      const company = await storage.getCompanyByUserId(userId!);
      if (!company) {
        return res.status(404).json({ message: "No tienes empresa registrada" });
      }
      res.json(company);
    } catch (err) {
      next(err);
    }
  });

  // ── My Products (seller) ────────────────────────────────────
  app.get("/api/my/products", requireAuth(), requireBusiness(), async (req: any, res, next) => {
    try {
      const { userId } = getAuth(req);
      const company = await storage.getCompanyByUserId(userId!);
      if (!company) {
        return res.status(404).json({ message: "No tienes empresa registrada" });
      }
      const myProducts = await storage.getProductsByCompanyId(company.id);
      res.json(myProducts);
    } catch (err) {
      next(err);
    }
  });

  // ── Create Product (seller) ─────────────────────────────────
  app.post("/api/my/products", requireAuth(), requireBusiness(), async (req: any, res, next) => {
    try {
      const parsed = insertProductSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: "Datos inválidos",
          errors: parsed.error.flatten().fieldErrors,
        });
      }
      const { userId } = getAuth(req);
      const company = await storage.getCompanyByUserId(userId!);
      if (!company) {
        return res.status(404).json({ message: "No tienes empresa registrada" });
      }
      const product = await storage.createProduct(company.id, parsed.data);
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  });

  // ── Update Product (seller) ─────────────────────────────────
  app.put("/api/my/products/:id", requireAuth(), requireBusiness(), async (req: any, res, next) => {
    try {
      const parsed = insertProductSchema.partial().safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: "Datos inválidos",
          errors: parsed.error.flatten().fieldErrors,
        });
      }
      const { userId } = getAuth(req);
      const company = await storage.getCompanyByUserId(userId!);
      if (!company) {
        return res.status(404).json({ message: "No tienes empresa registrada" });
      }
      const updated = await storage.updateProduct(req.params.id, company.id, parsed.data);
      if (!updated) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      res.json(updated);
    } catch (err) {
      next(err);
    }
  });

  // ── Delete Product (seller) ─────────────────────────────────
  app.delete("/api/my/products/:id", requireAuth(), requireBusiness(), async (req: any, res, next) => {
    try {
      const { userId } = getAuth(req);
      const company = await storage.getCompanyByUserId(userId!);
      if (!company) {
        return res.status(404).json({ message: "No tienes empresa registrada" });
      }
      const deleted = await storage.deleteProduct(req.params.id, company.id);
      if (!deleted) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      res.json({ message: "Producto eliminado" });
    } catch (err) {
      next(err);
    }
  });

  // ── Global Search ───────────────────────────────────────────
  app.get("/api/search", async (req, res, next) => {
    try {
      const q = (req.query.q as string) || "";
      if (!q || q.length < 2) {
        return res.json({ companies: [], products: [] });
      }
      const results = await storage.searchGlobal(q);
      res.json(results);
    } catch (err) {
      next(err);
    }
  });

  return httpServer;
}
