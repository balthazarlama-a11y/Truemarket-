import type { Express } from "express";
import type { Server } from "http";
import passport from "passport";
import { storage } from "./storage";
import { hashPassword, requireAuth, requireRole } from "./auth";
import { insertUserSchema, registerCompanySchema, loginSchema, insertProductSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ── Register Buyer ──────────────────────────────────────────
  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const parsed = insertUserSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: "Datos inválidos",
          errors: parsed.error.flatten().fieldErrors,
        });
      }

      const { email, name, password } = parsed.data;

      const existing = await storage.getUserByEmail(email);
      if (existing) {
        return res.status(409).json({ message: "Este email ya está registrado" });
      }

      const hashedPassword = hashPassword(password);
      const user = await storage.createUser({
        email,
        name,
        password: hashedPassword,
        role: "buyer",
      });

      req.login({ ...user, password: undefined } as any, (err) => {
        if (err) return next(err);
        const { password: _, ...userWithoutPassword } = user;
        return res.status(201).json(userWithoutPassword);
      });
    } catch (err) {
      next(err);
    }
  });

  // ── Register Company ────────────────────────────────────────
  app.post("/api/auth/register-company", async (req, res, next) => {
    try {
      const parsed = registerCompanySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: "Datos inválidos",
          errors: parsed.error.flatten().fieldErrors,
        });
      }

      const { email, name, password, ...companyData } = parsed.data;

      const existing = await storage.getUserByEmail(email);
      if (existing) {
        return res.status(409).json({ message: "Este email ya está registrado" });
      }

      const hashedPassword = hashPassword(password);
      const user = await storage.createUser({
        email,
        name,
        password: hashedPassword,
        role: "seller",
      });

      await storage.createCompany(user.id, companyData);

      req.login({ ...user, password: undefined } as any, (err) => {
        if (err) return next(err);
        const { password: _, ...userWithoutPassword } = user;
        return res.status(201).json(userWithoutPassword);
      });
    } catch (err) {
      next(err);
    }
  });

  // ── Login ───────────────────────────────────────────────────
  app.post("/api/auth/login", (req, res, next) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Datos inválidos",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Credenciales inválidas" });
      }

      req.login(user, (err) => {
        if (err) return next(err);
        const { password, ...userWithoutPassword } = user;
        return res.json(userWithoutPassword);
      });
    })(req, res, next);
  });

  // ── Logout ──────────────────────────────────────────────────
  app.post("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.json({ message: "Sesión cerrada" });
    });
  });

  // ── Get Current User ────────────────────────────────────────
  app.get("/api/auth/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "No autenticado" });
    }
    res.json(req.user);
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
      // Increment view count
      await storage.incrementCompanyViews(company.id);
      const companyProducts = await storage.getProductsByCompanyId(company.id);
      res.json({ company: { ...company, viewCount: (company.viewCount || 0) + 1 }, products: companyProducts });
    } catch (err) {
      next(err);
    }
  });

  // ── My Company (seller) ─────────────────────────────────────
  app.get("/api/my/company", requireAuth, requireRole("seller"), async (req, res, next) => {
    try {
      const user = req.user as any;
      const company = await storage.getCompanyByUserId(user.id);
      if (!company) {
        return res.status(404).json({ message: "No tienes empresa registrada" });
      }
      res.json(company);
    } catch (err) {
      next(err);
    }
  });

  // ── My Products (seller) ────────────────────────────────────
  app.get("/api/my/products", requireAuth, requireRole("seller"), async (req, res, next) => {
    try {
      const user = req.user as any;
      const company = await storage.getCompanyByUserId(user.id);
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
  app.post("/api/my/products", requireAuth, requireRole("seller"), async (req, res, next) => {
    try {
      const parsed = insertProductSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: "Datos inválidos",
          errors: parsed.error.flatten().fieldErrors,
        });
      }
      const user = req.user as any;
      const company = await storage.getCompanyByUserId(user.id);
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
  app.put("/api/my/products/:id", requireAuth, requireRole("seller"), async (req, res, next) => {
    try {
      const parsed = insertProductSchema.partial().safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: "Datos inválidos",
          errors: parsed.error.flatten().fieldErrors,
        });
      }
      const user = req.user as any;
      const company = await storage.getCompanyByUserId(user.id);
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
  app.delete("/api/my/products/:id", requireAuth, requireRole("seller"), async (req, res, next) => {
    try {
      const user = req.user as any;
      const company = await storage.getCompanyByUserId(user.id);
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
