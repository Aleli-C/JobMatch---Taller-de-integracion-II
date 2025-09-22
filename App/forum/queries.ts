// lib/forum/queries.ts
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ===== Types =====
export type ForoListItem = {
  id: number;
  titulo: string;
  fecha: Date;
  usuarioId: number;
};

// ===== Input schema (paginación + búsqueda) =====
export const foroListSchema = z.object({
  take: z.coerce.number().int().min(1).max(50).default(20),
  cursor: z.coerce.number().int().optional(),
  q: z.string().trim().min(1).optional(),
  usuarioId: z.coerce.number().int().optional(),
  order: z.enum(["newest","oldest"]).default("newest"),
});

export type ForoListInput = z.input<typeof foroListSchema>;
// ===== Listado con cursor =====
export async function getForos(input: ForoListInput = {}) {
  const { take, cursor, q, usuarioId, order } = foroListSchema.parse(input);

  const where = {
    AND: [
      usuarioId ? { usuarioId } : {},
      q
        ? {
            OR: [
              { titulo: { contains: q, mode: "insensitive" } },
              { consulta: { contains: q, mode: "insensitive" } },
            ],
          }
        : {},
    ],
  };

  const items = await prisma.foro.findMany({
    where,
    take: take + 1, // +1 para detectar si hay siguiente página
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: [{ fecha: order === "newest" ? "desc" : "asc" }, { id: "desc" }],
    select: { id: true, titulo: true, fecha: true, usuarioId: true },
  });

  const hasMore = items.length > take;
  const sliced = hasMore ? items.slice(0, take) : items;
  const nextCursor = hasMore ? sliced[sliced.length - 1]?.id : undefined;

  return { items: sliced as ForoListItem[], nextCursor };
}

// ===== Detalle por id =====
export async function getForoById(id: number) {
  const foro = await prisma.foro.findUnique({
    where: { id },
    select: {
      id: true,
      titulo: true,
      consulta: true,
      fecha: true,
      usuarioId: true,
      // Relaciones opcionales:
      // usuario: { select: { id: true, nombre: true } },
      // respuestas: { select: { id: true, respuesta: true, fecha: true, usuarioId: true } },
    },
  });
  if (!foro) throw new Error("Foro no encontrado");
  return foro;
}

// ===== Revalidación UI =====
export async function revalidateForumList() {
  revalidatePath("/forum");
}
