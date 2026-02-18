import { type User, type InsertUser, type Company, type InsertCompany, type Product, type InsertProduct, users, companies, products } from "@shared/schema";
import { eq, ilike, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

// ── Interface ────────────────────────────────────────────────
export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser & { role?: string }): Promise<User>;
  createCompany(userId: string, company: Omit<InsertCompany, "email" | "name" | "password">): Promise<Company>;
  getCompanyByUserId(userId: string): Promise<Company | undefined>;
  getAllCompanies(): Promise<Company[]>;
  getCompanyById(id: string): Promise<Company | undefined>;
  getProductsByCompanyId(companyId: string): Promise<Product[]>;
  // Product CRUD
  createProduct(companyId: string, product: InsertProduct): Promise<Product>;
  updateProduct(id: string, companyId: string, data: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string, companyId: string): Promise<boolean>;
  getProductById(id: string): Promise<Product | undefined>;
  // View counter
  incrementCompanyViews(companyId: string): Promise<void>;
  // Search
  searchGlobal(query: string): Promise<{ companies: Company[]; products: (Product & { companyName?: string })[] }>;
}

// ── Database Storage ─────────────────────────────────────────
let db: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!db) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    const pool = new pg.Pool({ connectionString: databaseUrl });
    db = drizzle(pool);
  }
  return db;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await getDb().select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await getDb().select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser & { role?: string }): Promise<User> {
    const result = await getDb()
      .insert(users)
      .values({
        email: insertUser.email,
        name: insertUser.name,
        password: insertUser.password,
        role: insertUser.role || "buyer",
      })
      .returning();
    return result[0];
  }

  async createCompany(
    userId: string,
    companyData: Omit<InsertCompany, "email" | "name" | "password">
  ): Promise<Company> {
    const result = await getDb()
      .insert(companies)
      .values({
        userId,
        companyName: companyData.companyName,
        rut: companyData.rut,
        description: companyData.description || null,
        category: companyData.category,
        companyType: companyData.companyType,
        phone: companyData.phone,
        address: companyData.address || null,
      })
      .returning();
    return result[0];
  }

  async getCompanyByUserId(userId: string): Promise<Company | undefined> {
    const result = await getDb()
      .select()
      .from(companies)
      .where(eq(companies.userId, userId))
      .limit(1);
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

  // Product CRUD
  async createProduct(companyId: string, product: InsertProduct): Promise<Product> {
    const result = await getDb()
      .insert(products)
      .values({
        companyId,
        name: product.name,
        description: product.description || null,
        price: product.price || null,
        category: product.category || null,
        imageUrl: product.imageUrl || null,
        status: "active",
      })
      .returning();
    return result[0];
  }

  async updateProduct(id: string, companyId: string, data: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = await getDb().select().from(products)
      .where(eq(products.id, id)).limit(1);
    if (!existing[0] || existing[0].companyId !== companyId) return undefined;

    const result = await getDb()
      .update(products)
      .set({
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description || null }),
        ...(data.price !== undefined && { price: data.price || null }),
        ...(data.category !== undefined && { category: data.category || null }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl || null }),
      })
      .where(eq(products.id, id))
      .returning();
    return result[0];
  }

  async deleteProduct(id: string, companyId: string): Promise<boolean> {
    const existing = await getDb().select().from(products)
      .where(eq(products.id, id)).limit(1);
    if (!existing[0] || existing[0].companyId !== companyId) return false;
    await getDb().delete(products).where(eq(products.id, id));
    return true;
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const result = await getDb().select().from(products).where(eq(products.id, id)).limit(1);
    return result[0];
  }

  async incrementCompanyViews(companyId: string): Promise<void> {
    await getDb()
      .update(companies)
      .set({ viewCount: sql`COALESCE(${companies.viewCount}, 0) + 1` })
      .where(eq(companies.id, companyId));
  }

  async searchGlobal(query: string): Promise<{ companies: Company[]; products: (Product & { companyName?: string })[] }> {
    const pattern = `%${query}%`;
    const matchedCompanies = await getDb().select().from(companies)
      .where(or(
        ilike(companies.companyName, pattern),
        ilike(companies.category, pattern),
      ));
    const matchedProducts = await getDb()
      .select({
        id: products.id,
        companyId: products.companyId,
        name: products.name,
        description: products.description,
        price: products.price,
        category: products.category,
        imageUrl: products.imageUrl,
        status: products.status,
        createdAt: products.createdAt,
        companyName: companies.companyName,
      })
      .from(products)
      .leftJoin(companies, eq(products.companyId, companies.id))
      .where(or(
        ilike(products.name, pattern),
        ilike(products.category, pattern),
        ilike(companies.companyName, pattern),
      ));
    return { companies: matchedCompanies, products: matchedProducts.map(p => ({ ...p, companyName: p.companyName ?? undefined })) };
  }
}

// ── In-Memory Storage (fallback for dev without DB) ──────────
export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private companies: Map<string, Company> = new Map();
  private products: Map<string, Product> = new Map();
  private counter = 0;

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((u) => u.email === email);
  }

  async createUser(insertUser: InsertUser & { role?: string }): Promise<User> {
    const id = String(++this.counter);
    const user: User = {
      id,
      email: insertUser.email,
      name: insertUser.name,
      password: insertUser.password,
      role: insertUser.role || "buyer",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async createCompany(
    userId: string,
    companyData: Omit<InsertCompany, "email" | "name" | "password">
  ): Promise<Company> {
    const id = String(++this.counter);
    const company: Company = {
      id,
      userId,
      companyName: companyData.companyName,
      rut: companyData.rut,
      description: companyData.description || null,
      category: companyData.category,
      companyType: companyData.companyType,
      phone: companyData.phone,
      address: companyData.address || null,
      logoUrl: null,
      isVerified: false,
      viewCount: 0,
      createdAt: new Date(),
    };
    this.companies.set(id, company);
    return company;
  }

  async getCompanyByUserId(userId: string): Promise<Company | undefined> {
    return Array.from(this.companies.values()).find((c) => c.userId === userId);
  }

  async getAllCompanies(): Promise<Company[]> {
    return Array.from(this.companies.values());
  }

  async getCompanyById(id: string): Promise<Company | undefined> {
    return this.companies.get(id);
  }

  async getProductsByCompanyId(companyId: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter((p) => p.companyId === companyId);
  }

  async createProduct(companyId: string, product: InsertProduct): Promise<Product> {
    const id = String(++this.counter);
    const p: Product = {
      id,
      companyId,
      name: product.name,
      description: product.description || null,
      price: product.price || null,
      category: product.category || null,
      imageUrl: product.imageUrl || null,
      status: "active",
      createdAt: new Date(),
    };
    this.products.set(id, p);
    return p;
  }

  async updateProduct(id: string, companyId: string, data: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing || existing.companyId !== companyId) return undefined;
    const updated = { ...existing, ...data };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string, companyId: string): Promise<boolean> {
    const existing = this.products.get(id);
    if (!existing || existing.companyId !== companyId) return false;
    this.products.delete(id);
    return true;
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async incrementCompanyViews(companyId: string): Promise<void> {
    const company = this.companies.get(companyId);
    if (company) {
      company.viewCount = (company.viewCount || 0) + 1;
    }
  }

  async searchGlobal(query: string): Promise<{ companies: Company[]; products: (Product & { companyName?: string })[] }> {
    const q = query.toLowerCase();
    const matchedCompanies = Array.from(this.companies.values()).filter(
      (c) => c.companyName.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q)
    );
    const matchedProducts = Array.from(this.products.values())
      .filter((p) => p.name.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q))
      .map((p) => ({
        ...p,
        companyName: Array.from(this.companies.values()).find((c) => c.id === p.companyId)?.companyName,
      }));
    return { companies: matchedCompanies, products: matchedProducts };
  }
}

// Use DatabaseStorage if DATABASE_URL is set, otherwise MemStorage
export const storage: IStorage = process.env.DATABASE_URL
  ? new DatabaseStorage()
  : new MemStorage();
