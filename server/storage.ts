import { type Company, type InsertCompany, type Product, type InsertProduct, companies, products } from "@shared/schema";
import { eq, ilike, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

// ── Interface ────────────────────────────────────────────────
export interface IStorage {
  createCompany(userId: string, company: Omit<InsertCompany, "email" | "name" | "password">): Promise<Company>;
  getCompanyByUserId(userId: string): Promise<Company | undefined>;
  getAllCompanies(): Promise<Company[]>;
  getCompanyById(id: string): Promise<Company | undefined>;
  getProductsByCompanyId(companyId: string): Promise<Product[]>;
  getProductsByUserId(userId: string): Promise<Product[]>;
  getAllProducts(): Promise<(Product & { companyName?: string })[]>;
  createProduct(companyId: string | null, userId: string, product: InsertProduct, isVerified: boolean): Promise<Product>;
  updateProduct(id: string, companyId: string, data: Partial<InsertProduct>): Promise<Product | undefined>;
  updateProductByUser(id: string, userId: string, data: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string, companyId: string): Promise<boolean>;
  deleteProductByUser(id: string, userId: string): Promise<boolean>;
  getProductById(id: string): Promise<Product | undefined>;
  incrementCompanyViews(companyId: string): Promise<void>;
  searchGlobal(query: string): Promise<{ companies: Company[]; products: (Product & { companyName?: string })[] }>;
}

// ── Database Storage ─────────────────────────────────────────
let db: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!db) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error("DATABASE_URL environment variable is required");
    const pool = new pg.Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }
    });

    // Catch pool errors so they don't crash the serverless function process
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });

    db = drizzle(pool);
  }
  return db;
}

export class DatabaseStorage implements IStorage {
  async createCompany(userId: string, companyData: Omit<InsertCompany, "email" | "name" | "password">): Promise<Company> {
    const result = await getDb().insert(companies).values({
      userId, companyName: companyData.companyName, rut: companyData.rut,
      description: companyData.description || null, category: companyData.category,
      companyType: companyData.companyType, phone: companyData.phone, address: companyData.address || null,
    }).returning();
    return result[0];
  }

  async getCompanyByUserId(userId: string): Promise<Company | undefined> {
    const result = await getDb().select().from(companies).where(eq(companies.userId, userId)).limit(1);
    return result[0];
  }

  async getAllCompanies(): Promise<Company[]> {
    return await getDb().select().from(companies);
  }

  async getCompanyById(id: string): Promise<Company | undefined> {
    const result = await getDb().select().from(companies).where(eq(companies.id, id)).limit(1);
    return result[0];
  }

  async getProductsByCompanyId(companyId: string): Promise<Product[]> {
    return await getDb().select().from(products).where(eq(products.companyId, companyId));
  }

  async getProductsByUserId(userId: string): Promise<Product[]> {
    return await getDb().select().from(products).where(eq(products.userId, userId));
  }

  async getAllProducts(): Promise<(Product & { companyName?: string })[]> {
    const results = await getDb()
      .select({
        id: products.id, companyId: products.companyId, userId: products.userId,
        name: products.name, description: products.description, price: products.price,
        category: products.category, images: products.images, status: products.status,
        isVerified: products.isVerified, createdAt: products.createdAt,
        companyName: companies.companyName,
      })
      .from(products)
      .leftJoin(companies, eq(products.companyId, companies.id));
    return results.map(p => ({ ...p, companyName: p.companyName ?? undefined }));
  }

  async createProduct(companyId: string | null, userId: string, product: InsertProduct, isVerified: boolean): Promise<Product> {
    const result = await getDb().insert(products).values({
      companyId, userId, name: product.name,
      description: product.description || null, price: product.price || null,
      category: product.category || null, images: product.images || null,
      status: "active", isVerified,
    }).returning();
    return result[0];
  }

  async updateProduct(id: string, companyId: string, data: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = await getDb().select().from(products).where(eq(products.id, id)).limit(1);
    if (!existing[0] || existing[0].companyId !== companyId) return undefined;
    const result = await getDb().update(products).set({
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description || null }),
      ...(data.price !== undefined && { price: data.price || null }),
      ...(data.category !== undefined && { category: data.category || null }),
      ...(data.images !== undefined && { images: data.images || null }),
    }).where(eq(products.id, id)).returning();
    return result[0];
  }

  async updateProductByUser(id: string, userId: string, data: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = await getDb().select().from(products).where(eq(products.id, id)).limit(1);
    if (!existing[0] || existing[0].userId !== userId) return undefined;
    const result = await getDb().update(products).set({
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description || null }),
      ...(data.price !== undefined && { price: data.price || null }),
      ...(data.category !== undefined && { category: data.category || null }),
      ...(data.images !== undefined && { images: data.images || null }),
    }).where(eq(products.id, id)).returning();
    return result[0];
  }

  async deleteProduct(id: string, companyId: string): Promise<boolean> {
    const existing = await getDb().select().from(products).where(eq(products.id, id)).limit(1);
    if (!existing[0] || existing[0].companyId !== companyId) return false;
    await getDb().delete(products).where(eq(products.id, id));
    return true;
  }

  async deleteProductByUser(id: string, userId: string): Promise<boolean> {
    const existing = await getDb().select().from(products).where(eq(products.id, id)).limit(1);
    if (!existing[0] || existing[0].userId !== userId) return false;
    await getDb().delete(products).where(eq(products.id, id));
    return true;
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const result = await getDb().select().from(products).where(eq(products.id, id)).limit(1);
    return result[0];
  }

  async incrementCompanyViews(companyId: string): Promise<void> {
    await getDb().update(companies).set({ viewCount: sql`COALESCE(${companies.viewCount}, 0) + 1` }).where(eq(companies.id, companyId));
  }

  async searchGlobal(query: string): Promise<{ companies: Company[]; products: (Product & { companyName?: string })[] }> {
    const pattern = `%${query}%`;
    const matchedCompanies = await getDb().select().from(companies).where(or(ilike(companies.companyName, pattern), ilike(companies.category, pattern)));
    const matchedProducts = await getDb()
      .select({
        id: products.id, companyId: products.companyId, userId: products.userId,
        name: products.name, description: products.description, price: products.price,
        category: products.category, images: products.images, status: products.status,
        isVerified: products.isVerified, createdAt: products.createdAt,
        companyName: companies.companyName,
      })
      .from(products).leftJoin(companies, eq(products.companyId, companies.id))
      .where(or(ilike(products.name, pattern), ilike(products.category, pattern), ilike(companies.companyName, pattern)));
    return { companies: matchedCompanies, products: matchedProducts.map(p => ({ ...p, companyName: p.companyName ?? undefined })) };
  }
}

// ── In-Memory Storage ────────────────────────────────────────
export class MemStorage implements IStorage {
  private companiesMap: Map<string, Company> = new Map();
  private productsMap: Map<string, Product> = new Map();
  private counter = 0;

  async createCompany(userId: string, companyData: Omit<InsertCompany, "email" | "name" | "password">): Promise<Company> {
    const id = String(++this.counter);
    const company: Company = {
      id, userId, companyName: companyData.companyName, rut: companyData.rut,
      description: companyData.description || null, category: companyData.category,
      companyType: companyData.companyType, phone: companyData.phone,
      address: companyData.address || null, logoUrl: null, isVerified: false, viewCount: 0, createdAt: new Date(),
    };
    this.companiesMap.set(id, company);
    return company;
  }

  async getCompanyByUserId(userId: string): Promise<Company | undefined> {
    return Array.from(this.companiesMap.values()).find(c => c.userId === userId);
  }

  async getAllCompanies(): Promise<Company[]> {
    return Array.from(this.companiesMap.values());
  }

  async getCompanyById(id: string): Promise<Company | undefined> {
    return this.companiesMap.get(id);
  }

  async getProductsByCompanyId(companyId: string): Promise<Product[]> {
    return Array.from(this.productsMap.values()).filter(p => p.companyId === companyId);
  }

  async getProductsByUserId(userId: string): Promise<Product[]> {
    return Array.from(this.productsMap.values()).filter(p => p.userId === userId);
  }

  async getAllProducts(): Promise<(Product & { companyName?: string })[]> {
    return Array.from(this.productsMap.values()).map(p => ({
      ...p,
      companyName: p.companyId ? Array.from(this.companiesMap.values()).find(c => c.id === p.companyId)?.companyName : undefined,
    }));
  }

  async createProduct(companyId: string | null, userId: string, product: InsertProduct, isVerified: boolean): Promise<Product> {
    const id = String(++this.counter);
    const p: Product = {
      id, companyId, userId, name: product.name,
      description: product.description || null, price: product.price || null,
      category: product.category || null, images: product.images || null,
      status: "active", isVerified, createdAt: new Date(),
    };
    this.productsMap.set(id, p);
    return p;
  }

  async updateProduct(id: string, companyId: string, data: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.productsMap.get(id);
    if (!existing || existing.companyId !== companyId) return undefined;
    const updated = { ...existing, ...data };
    this.productsMap.set(id, updated);
    return updated;
  }

  async updateProductByUser(id: string, userId: string, data: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.productsMap.get(id);
    if (!existing || existing.userId !== userId) return undefined;
    const updated = { ...existing, ...data };
    this.productsMap.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string, companyId: string): Promise<boolean> {
    const existing = this.productsMap.get(id);
    if (!existing || existing.companyId !== companyId) return false;
    this.productsMap.delete(id);
    return true;
  }

  async deleteProductByUser(id: string, userId: string): Promise<boolean> {
    const existing = this.productsMap.get(id);
    if (!existing || existing.userId !== userId) return false;
    this.productsMap.delete(id);
    return true;
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.productsMap.get(id);
  }

  async incrementCompanyViews(companyId: string): Promise<void> {
    const company = this.companiesMap.get(companyId);
    if (company) company.viewCount = (company.viewCount || 0) + 1;
  }

  async searchGlobal(query: string): Promise<{ companies: Company[]; products: (Product & { companyName?: string })[] }> {
    const q = query.toLowerCase();
    const matchedCompanies = Array.from(this.companiesMap.values()).filter(c => c.companyName.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q));
    const matchedProducts = Array.from(this.productsMap.values())
      .filter(p => p.name.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q))
      .map(p => ({ ...p, companyName: p.companyId ? Array.from(this.companiesMap.values()).find(c => c.id === p.companyId)?.companyName : undefined }));
    return { companies: matchedCompanies, products: matchedProducts };
  }
}

export const storage: IStorage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
