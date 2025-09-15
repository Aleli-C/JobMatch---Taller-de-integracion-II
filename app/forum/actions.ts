"use server";
import { z } from "zod";
import { forumThreadCreateSchema } from "@/lib/schemas/forum";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";;

export type CreateThreadState = {
  ok?: true;
  threadId?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

function getCurrentUserId(): string | null {
  // Ajusta a tu auth real (NextAuth, custom, etc.)
  return cookies().get("uid")?.value ?? null;
}

// Acción para formularios (useFormState)
export async function createThreadAction(
  _prev: CreateThreadState,
  formData: FormData
): Promise<CreateThreadState> {
  const userId = getCurrentUserId();
  if (!userId) return { error: "No autenticado" };

  // Normaliza tags del form: "tag1, tag2"
  const rawTags = String(formData.get("tags") || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const parsed = forumThreadCreateSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    tags: rawTags.length ? rawTags : undefined,
    categoryId: formData.get("categoryId") || undefined,
  });

  if (!parsed.success) {
    const fe = parsed.error.flatten().fieldErrors;
    return { error: "Validación fallida", fieldErrors: fe as any };
  }

  // Persiste directo con Prisma
  const thread = await prisma.thread.create({
    data: {
      title: parsed.data.title,
      body: parsed.data.body,
      tags: parsed.data.tags ?? [],
      categoryId: parsed.data.categoryId ?? null,
      userId,
    },
    select: { id: true },
  });

  // Revalida listados del foro
  revalidatePath("/forum");
  return { ok: true, threadId: thread.id };
}

// Acción programática (llamable desde Server Components)
export async function createThread(input: {
  title: string;
  body: string;
  tags?: string[];
  categoryId?: string | null;
}): Promise<{ id: string }> {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("No autenticado");

  const parsed = forumThreadCreateSchema.parse({
    ...input,
    categoryId: input.categoryId || undefined,
  });

  const thread = await prisma.thread.create({
    data: {
      title: parsed.title,
      body: parsed.body,
      tags: parsed.tags ?? [],
      categoryId: parsed.categoryId ?? null,
      userId,
    },
    select: { id: true },
  });

  revalidatePath("/forum");
  return thread;
}

export type UpdateThreadState = {
  ok?: true;
  threadId?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

// Deriva un schema de actualización: todos opcionales + id requerido
const forumThreadUpdateSchema = forumThreadCreateSchema
  .partial()
  .extend({
    id: z.string().min(1),
    // permitir null para limpiar categoría
    categoryId: z.string().min(1).nullable().optional(),
  })
  .refine(
    (d) =>
      d.title !== undefined ||
      d.body !== undefined ||
      d.tags !== undefined ||
      d.categoryId !== undefined,
    { message: "Sin cambios" }
  );

function getCurrentUserId(): string | null {
  return cookies().get("uid")?.value ?? null;
}

/** Accción para formularios (useFormState) */
export async function updateThreadAction(
  _prev: UpdateThreadState,
  formData: FormData
): Promise<UpdateThreadState> {
  const userId = getCurrentUserId();
  if (!userId) return { error: "No autenticado" };

  const id = String(formData.get("id") || "");
  // Normaliza tags: "tag1, tag2" -> string[]
  const tagsField = formData.get("tags");
  const tags =
    tagsField === null
      ? undefined
      : String(tagsField)
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length >= 1); // [] para limpiar, undefined para no tocar

  // categoryId: undefined = no tocar; "" = null; "abc" = set
  const rawCat = formData.get("categoryId");
  const categoryId =
    rawCat === null ? undefined : String(rawCat) === "" ? null : String(rawCat);

  const parsed = forumThreadUpdateSchema.safeParse({
    id,
    title: formData.get("title") ?? undefined,
    body: formData.get("body") ?? undefined,
    tags,
    categoryId,
  });

  if (!parsed.success) {
    const fe = parsed.error.flatten().fieldErrors;
    return { error: "Validación fallida", fieldErrors: fe as any };
  }

  // Ownership check
  const existing = await prisma.thread.findUnique({
    where: { id: parsed.data.id },
    select: { userId: true },
  });
  if (!existing) return { error: "Foro no encontrado" };
  if (existing.userId !== userId) return { error: "No autorizado" };

  // Build delta: solo campos presentes
  const delta: {
    title?: string;
    body?: string;
    tags?: string[];
    categoryId?: string | null;
  } = {};
  if (parsed.data.title !== undefined) delta.title = parsed.data.title;
  if (parsed.data.body !== undefined) delta.body = parsed.data.body;
  if (parsed.data.tags !== undefined) delta.tags = parsed.data.tags; // [] limpia
  if (parsed.data.categoryId !== undefined) delta.categoryId = parsed.data.categoryId;

  const updated = await prisma.thread.update({
    where: { id: parsed.data.id },
    data: delta,
    select: { id: true },
  });

  revalidatePath("/forum");
  revalidatePath(`/forum/${updated.id}`);
  return { ok: true, threadId: updated.id };
}

/** Acción programática (Server Components o RPC interno) */
export async function updateThread(input: {
  id: string;
  title?: string;
  body?: string;
  tags?: string[]; // si pasas [], se limpian
  categoryId?: string | null; // null para limpiar, undefined para no tocar
}): Promise<{ id: string }> {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("No autenticado");

  const parsed = forumThreadUpdateSchema.parse(input);

  const existing = await prisma.thread.findUnique({
    where: { id: parsed.id },
    select: { userId: true },
  });
  if (!existing) throw new Error("Foro no encontrado");
  if (existing.userId !== userId) throw new Error("No autorizado");

  const delta: {
    title?: string;
    body?: string;
    tags?: string[];
    categoryId?: string | null;
  } = {};
  if (parsed.title !== undefined) delta.title = parsed.title;
  if (parsed.body !== undefined) delta.body = parsed.body;
  if (parsed.tags !== undefined) delta.tags = parsed.tags;
  if (parsed.categoryId !== undefined) delta.categoryId = parsed.categoryId;

  const updated = await prisma.thread.update({
    where: { id: parsed.id },
    data: delta,
    select: { id: true },
  });

  revalidatePath("/forum");
  revalidatePath(`/forum/${updated.id}`);
  return updated;
}
