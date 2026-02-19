import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ── Companies table ──────────────────────────────────────────
export const companies = pgTable("companies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  companyName: text("company_name").notNull(),
  rut: text("rut").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  companyType: text("company_type").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  logoUrl: text("logo_url"),
  isVerified: boolean("is_verified").default(false),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// ── Products table ───────────────────────────────────────────
// companyId is nullable: set for business products, null for user products
// userId stores the Clerk user ID of whoever created the product
// isVerified: true for business products, false for regular user products
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id"),
  userId: varchar("user_id"),
  name: text("name").notNull(),
  description: text("description"),
  price: text("price"),
  category: text("category"),
  imageUrl: text("image_url"),
  status: text("status").default("active"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ── Zod Schemas ──────────────────────────────────────────────

export const insertCompanySchema = createInsertSchema(companies).pick({
  companyName: true,
  rut: true,
  description: true,
  category: true,
  companyType: true,
  phone: true,
  address: true,
});

export const insertProductSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  description: z.string().optional(),
  price: z.string().optional(),
  category: z.string().optional(),
  imageUrl: z.string().optional(),
});

// ── Types ────────────────────────────────────────────────────
export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
