import { z } from "zod";

// ─── UPDATE USER PROFILE ────────────────────────────────
export const updateUserSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  username: z.string().min(3).max(30).optional(),
  bio: z.string().max(200).optional(),
  avatar: z.string().optional(),
  email: z.string().email().optional(),
  socials: z.object({
    instagram: z.string().optional(),
    tiktok: z.string().optional(),
    twitter: z.string().optional(),
    youtube: z.string().optional(),
    website: z.string().optional(),
  }).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
