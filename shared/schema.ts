import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ── Users table ──────────────────────────────────────────────
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  role: text("role").notNull().default("buyer"), // "buyer" | "seller"
  createdAt: timestamp("created_at").defaultNow(),
});

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
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: text("price"),
  category: text("category"),
  imageUrl: text("image_url"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ── Zod Schemas ──────────────────────────────────────────────

// Buyer registration
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  name: true,
  password: true,
});

// Login
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Password requerido"),
});

// Company registration (extended)
export const insertCompanySchema = createInsertSchema(companies).pick({
  companyName: true,
  rut: true,
  description: true,
  category: true,
  companyType: true,
  phone: true,
  address: true,
});

// Combined company + user registration
export const registerCompanySchema = z.object({
  // User fields
  email: z.string().email("Email inválido"),
  name: z.string().min(1, "Nombre requerido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  // Company fields
  companyName: z.string().min(1, "Nombre de empresa requerido"),
  rut: z.string().min(1, "RUT requerido"),
  description: z.string().optional(),
  category: z.string().min(1, "Categoría requerida"),
  companyType: z.string().min(1, "Tipo de empresa requerido"),
  phone: z.string().min(1, "Teléfono requerido"),
  address: z.string().optional(),
});

// Product creation
export const insertProductSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  description: z.string().optional(),
  price: z.string().optional(),
  category: z.string().optional(),
  imageUrl: z.string().optional(),
});

// ── Types ────────────────────────────────────────────────────
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
