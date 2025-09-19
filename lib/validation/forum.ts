// lib/validation/forum.ts
import { z } from "zod";

export const forumThreadCreateSchema = z.object({
  title: z.string().min(5, "Título muy corto").max(120),
  body: z.string().min(10, "Contenido muy corto").max(10000),
  tags: z.array(z.string().min(1)).max(5).optional(),
  categoryId: z.string().min(1).optional(),
});
export type ForumThreadCreate = z.infer<typeof forumThreadCreateSchema>;

export const forumThreadListSchema = z.object({
  take: z.number().int().min(1).max(50).optional().default(10),
  cursor: z.string().optional(),
  q: z.string().trim().min(1).optional(),
  categoryId: z.string().min(1).optional(),
  tags: z.array(z.string().min(1)).optional(),
  order: z.enum(["newest", "oldest"]).optional().default("newest"),
});
export type ForumThreadListInput = z.infer<typeof forumThreadListSchema>;
