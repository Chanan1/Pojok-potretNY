import { z } from "zod";

// ─── CREATE TEMPLATE ────────────────────────────────────
export const createTemplateSchema = z.object({
  name: z.string().min(1, "Nama template wajib diisi").max(100),
  description: z.string().max(500).optional(),
  src: z.string().min(1, "URL gambar wajib diisi"),
  category: z.string().min(1, "Kategori wajib dipilih"),
  frameCount: z.number().int().min(1).max(12),
  slots: z.array(z.object({
    id: z.string(),
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
  })).optional().default([]),
  backgroundColor: z.string().optional().default("transparent"),
  margin: z.number().int().min(0).max(50).optional().default(10),
  borderRadius: z.number().int().min(0).max(50).optional().default(0),
  isPublic: z.boolean().optional().default(true),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional().default("DRAFT"),
});

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;

// ─── UPDATE TEMPLATE ────────────────────────────────────
export const updateTemplateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  src: z.string().optional(),
  category: z.string().optional(),
  frameCount: z.number().int().min(1).max(12).optional(),
  slots: z.array(z.object({
    id: z.string(),
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
  })).optional(),
  backgroundColor: z.string().optional(),
  margin: z.number().int().min(0).max(50).optional(),
  borderRadius: z.number().int().min(0).max(50).optional(),
  isPublic: z.boolean().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
});

export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;

// ─── QUERY PARAMS ───────────────────────────────────────
export const templateQuerySchema = z.object({
  category: z.string().optional(),
  frameCount: z.coerce.number().int().optional(),
  search: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  creatorId: z.string().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  sort: z.enum(["newest", "popular", "likes"]).optional().default("newest"),
});

export type TemplateQueryInput = z.infer<typeof templateQuerySchema>;
