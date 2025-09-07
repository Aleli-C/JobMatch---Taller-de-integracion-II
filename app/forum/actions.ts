"use server";

import { forumThreadCreateSchema } from "@/lib/schemas/forum";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

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


