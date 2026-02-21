import type { Express } from "express";
import { storage } from "./storage";
import { insertProductSchema } from "../shared/schema";
import { requireAuth, requireRole } from "./middleware/auth";
import { clerkMiddleware, getAuth } from "@clerk/express";

export async function registerRoutes(app: Express): Promise<void> {
  // Configured in main index.ts for production, but good to have local
  app.use(clerkMiddleware());

  // ── Companies ────────────────────────────────────────────────
  app.get("/api/companies", async (_req, res) => {
    const companies = await storage.getAllCompanies();
    res.json(companies);
  });

  app.get("/api/companies/:id", async (req, res) => {
    const company = await storage.getCompanyById(req.params.id);
    if (!company) return res.status(404).json({ message: "Empresa no encontrada" });
    await storage.incrementCompanyViews(req.params.id);
    const products = await storage.getProductsByCompanyId(req.params.id);
    res.json({ company: { ...company, viewCount: (company.viewCount || 0) + 1 }, products });
  });

  app.post("/api/register-company", requireAuth, async (req, res) => {
    const userId = getAuth(req).userId!;
    const existing = await storage.getCompanyByUserId(userId);
    if (existing) return res.status(409).json({ message: "Ya tienes una empresa registrada" });
    const { companyName, rut, description, category, companyType, phone, address } = req.body;
    if (!companyName || !rut || !category || !companyType || !phone) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }
    const company = await storage.createCompany(userId, {
      companyName, rut, description, category, companyType, phone, address,
    });
    // Note: Role update happens in API handler or webhook in prod
    res.status(201).json(company);
  });

  app.get("/api/my/company", requireRole("business"), async (req, res) => {
    const userId = getAuth(req).userId!;
    const company = await storage.getCompanyByUserId(userId);
    if (!company) return res.status(404).json({ message: "No tienes empresa registrada" });
    res.json(company);
  });

  // ── Business Products (Verified) ─────────────────────────────
  app.get("/api/my/products", requireRole("business"), async (req, res) => {
    const userId = getAuth(req).userId!;
    const company = await storage.getCompanyByUserId(userId);
    if (!company) return res.status(404).json({ message: "No tienes empresa registrada" });
    const products = await storage.getProductsByCompanyId(company.id);
    res.json(products);
  });

  app.post("/api/my/products", requireRole("business"), async (req, res) => {
    try {
      const userId = getAuth(req).userId!;
      const parsed = insertProductSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Datos inválidos", errors: parsed.error.flatten().fieldErrors });
      const company = await storage.getCompanyByUserId(userId);
      if (!company) return res.status(404).json({ message: "No tienes empresa registrada" });
      const product = await storage.createProduct(company.id, userId, parsed.data, true);
      res.status(201).json(product);
    } catch (error: any) {
      console.error("Error creating product (/api/my/products):", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message || String(error) });
    }
  });

  app.put("/api/my/products/:id", requireRole("business"), async (req, res) => {
    const userId = getAuth(req).userId!;
    const parsed = insertProductSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Datos inválidos" });
    const company = await storage.getCompanyByUserId(userId);
    if (!company) return res.status(404).json({ message: "No tienes empresa registrada" });
    const updated = await storage.updateProduct(req.params.id, company.id, parsed.data);
    if (!updated) return res.status(404).json({ message: "Producto no encontrado o no autorizado" });
    res.json(updated);
  });

  app.delete("/api/my/products/:id", requireRole("business"), async (req, res) => {
    const userId = getAuth(req).userId!;
    const company = await storage.getCompanyByUserId(userId);
    if (!company) return res.status(404).json({ message: "No tienes empresa registrada" });
    const success = await storage.deleteProduct(req.params.id, company.id);
    if (!success) return res.status(404).json({ message: "Producto no encontrado o no autorizado" });
    res.json({ message: "Producto eliminado" });
  });

  // ── User Products (Unverified or Verified based on company) ──
  app.post("/api/products", requireAuth, async (req, res) => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        return res.status(401).json({ message: "No autenticado. Inicia sesión e intenta de nuevo." });
      }
      const body = req.body;
      if (!body || typeof body !== "object") {
        return res.status(400).json({ message: "No se recibió el cuerpo de la solicitud. Intenta de nuevo." });
      }
      const parsed = insertProductSchema.safeParse(body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Datos inválidos", errors: parsed.error.flatten().fieldErrors });
      }

      const company = await storage.getCompanyByUserId(userId);
      const product = await storage.createProduct(
        company?.id || null,
        userId,
        parsed.data,
        !!company // isVerified if company exists
      );
      res.status(201).json(product);
    } catch (error: any) {
      console.error("Error creating product (/api/products):", error);
      const message = error?.message || "Error al guardar el producto.";
      res.status(500).json({ message });
    }
  });

  app.get("/api/user/products", requireAuth, async (req, res) => {
    const userId = getAuth(req).userId!;
    const products = await storage.getProductsByUserId(userId);
    res.json(products);
  });

  app.put("/api/user/products/:id", requireAuth, async (req, res) => {
    const userId = getAuth(req).userId!;
    const parsed = insertProductSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Datos inválidos" });
    const updated = await storage.updateProductByUser(req.params.id, userId, parsed.data);
    if (!updated) return res.status(404).json({ message: "Producto no encontrado o no autorizado" });
    res.json(updated);
  });

  app.delete("/api/user/products/:id", requireAuth, async (req, res) => {
    const userId = getAuth(req).userId!;
    const success = await storage.deleteProductByUser(req.params.id, userId);
    if (!success) return res.status(404).json({ message: "Producto no encontrado o no autorizado" });
    res.json({ message: "Producto eliminado" });
  });

  // ── Public Products ──────────────────────────────────────────
  app.get("/api/products", async (_req, res) => {
    const products = await storage.getAllProducts();
    res.json(products);
  });

  app.get("/api/search", async (req, res) => {
    const q = req.query.q as string;
    if (!q || q.length < 2) return res.json({ companies: [], products: [] });
    const results = await storage.searchGlobal(q);
    res.json(results);
  });

  // Global error handler for Express routes
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("Express Global Error:", err);
    res.status(500).json({
      message: "Ha ocurrido un error inesperado al procesar tu solicitud.",
      error: err.message || String(err)
    });
  });

}
