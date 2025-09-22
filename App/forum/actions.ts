"use server";

import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// ---------- helpers ----------
async function getCurrentUserId(): Promise<number | null> {
  const store = await cookies();                  // Next 15: async
  const raw = store.get("uid")?.value ?? null;
  if (!raw) return null;
  const uid = Number(raw);
  return Number.isInteger(uid) ? uid : null;
}

// Acepta names del formulario viejo (title/body) o nuevos (titulo/consulta)
const createForoInput = z.object({
  titulo: z.string().min(1),
  consulta: z.string().min(1),
});
function normalizeCreate(form: FormData) {
  const titulo = String(form.get("titulo") ?? form.get("title") ?? "");
  const consulta = String(form.get("consulta") ?? form.get("body") ?? "");
  return { titulo, consulta };
}

const updateForoInput = z.object({
  id: z.coerce.number().int().positive(),
  titulo: z.string().min(1).optional(),
  consulta: z.string().min(1).optional(),
}).refine(d => d.titulo !== undefined || d.consulta !== undefined, { message: "Sin cambios" });

// ---------- tipos de estado ----------
export type CreateThreadState = {
  ok?: true;
  threadId?: number;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};
export type UpdateThreadState = CreateThreadState;

// ---------- acciones ----------
export async function createThreadAction(
  _prev: CreateThreadState,
  formData: FormData
): Promise<CreateThreadState> {
  const usuarioId = await getCurrentUserId();
  if (!usuarioId) return { error: "No autenticado" };

  const parsed = createForoInput.safeParse(normalizeCreate(formData));
  if (!parsed.success) {
    return { error: "Validación fallida", fieldErrors: parsed.error.flatten().fieldErrors as any };
  }

  const foro = await prisma.foro.create({
    data: {
      titulo: parsed.data.titulo,
      consulta: parsed.data.consulta,
      usuarioId,
      // fecha se auto-setea
    },
    select: { id: true },
  });

  revalidatePath("/forum");
  return { ok: true, threadId: foro.id };
}

export async function createThread(input: { titulo?: string; consulta?: string; title?: string; body?: string; }): Promise<{ id: number }> {
  const usuarioId = await getCurrentUserId();
  if (!usuarioId) throw new Error("No autenticado");
  const payload = createForoInput.parse({
    titulo: input.titulo ?? input.title ?? "",
    consulta: input.consulta ?? input.body ?? "",
  });

  const foro = await prisma.foro.create({
    data: { titulo: payload.titulo, consulta: payload.consulta, usuarioId },
    select: { id: true },
  });

  revalidatePath("/forum");
  return foro;
}

export async function updateThreadAction(
  _prev: UpdateThreadState,
  formData: FormData
): Promise<UpdateThreadState> {
  const usuarioId = await getCurrentUserId();
  if (!usuarioId) return { error: "No autenticado" };

  const parsed = updateForoInput.safeParse({
    id: formData.get("id"),
    titulo: formData.get("titulo") ?? formData.get("title") ?? undefined,
    consulta: formData.get("consulta") ?? formData.get("body") ?? undefined,
  });
  if (!parsed.success) {
    return { error: "Validación fallida", fieldErrors: parsed.error.flatten().fieldErrors as any };
  }

  const existing = await prisma.foro.findUnique({
    where: { id: parsed.data.id },
    select: { usuarioId: true },
  });
  if (!existing) return { error: "Foro no encontrado" };
  if (existing.usuarioId !== usuarioId) return { error: "No autorizado" };

  const updated = await prisma.foro.update({
    where: { id: parsed.data.id },
    data: {
      ...(parsed.data.titulo !== undefined ? { titulo: parsed.data.titulo } : {}),
      ...(parsed.data.consulta !== undefined ? { consulta: parsed.data.consulta } : {}),
    },
    select: { id: true },
  });

  revalidatePath("/forum");
  revalidatePath(`/forum/${updated.id}`);
  return { ok: true, threadId: updated.id };
}

export async function updateThread(input: { id: number | string; titulo?: string; consulta?: string; title?: string; body?: string; }): Promise<{ id: number }> {
  const usuarioId = await getCurrentUserId();
  if (!usuarioId) throw new Error("No autenticado");

  const parsed = updateForoInput.parse({
    id: input.id,
    titulo: input.titulo ?? input.title ?? undefined,
    consulta: input.consulta ?? input.body ?? undefined,
  });

  const existing = await prisma.foro.findUnique({
    where: { id: parsed.id },
    select: { usuarioId: true },
  });
  if (!existing) throw new Error("Foro no encontrado");
  if (existing.usuarioId !== usuarioId) throw new Error("No autorizado");

  const updated = await prisma.foro.update({
    where: { id: parsed.id },
    data: {
      ...(parsed.titulo !== undefined ? { titulo: parsed.titulo } : {}),
      ...(parsed.consulta !== undefined ? { consulta: parsed.consulta } : {}),
    },
    select: { id: true },
  });

  revalidatePath("/forum");
  revalidatePath(`/forum/${updated.id}`);
  return updated;
}
