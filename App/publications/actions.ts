// app/publications/actions.ts
"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// ------------ helpers ------------
type Scope = "own" | "view" | "all";
const PATHS = {
  own: ["/publications/publications_own", "/publications/own"],
  view: ["/publications/publications_view", "/publications/view"],
} as const;

function revalidatePublications(scope: Scope, id?: number) {
  const scopes = scope === "all" ? (["own", "view"] as const) : ([scope] as const);
  for (const s of scopes) {
    for (const base of PATHS[s]) {
      revalidatePath(base);
      if (id !== undefined) revalidatePath(`${base}/${id}`);
    }
  }
}

async function getCurrentUserId(): Promise<number | null> {
  const store = await cookies();
  const raw = store.get("uid")?.value ?? null;
  const n = raw ? Number(raw) : null;
  return Number.isInteger(n) ? n : null;
}

// normaliza nombres de campos del form
function pick<T extends string>(fd: FormData, ...keys: T[]): Record<T, string> {
  const out = {} as Record<T, string>;
  for (const k of keys) out[k] = String(fd.get(k) ?? "");
  return out;
}

// enums del schema Prisma
const TipoTrabajo = z.enum(["FULLTIME", "PARTTIME", "FREELANCE"]);
const EstadoPublicacion = z.enum(["ACTIVO", "INACTIVO", "CERRADO"]);

// ------------ schemas ------------
const createSchema = z.object({
  titulo: z.string().min(1),
  descripcion: z.string().min(1),
  remuneracion: z.coerce.number().nonnegative(),
  tipo: TipoTrabajo,
  categoriaId: z.coerce.number().int().positive(),
  ubicacionId: z.coerce.number().int().positive(),
  fechaCierre: z.preprocess(
    (v) => (v ? new Date(String(v)) : undefined),
    z.date().optional()
  ),
  // opcional, por si envías explícito
  estado: EstadoPublicacion.optional().default("ACTIVO"),
  __scope: z.custom<Scope>().optional().default("all"),
});

const updateSchema = z
  .object({
    id: z.coerce.number().int().positive(),
    titulo: z.string().min(1).optional(),
    descripcion: z.string().min(1).optional(),
    remuneracion: z.coerce.number().nonnegative().optional(),
    tipo: TipoTrabajo.optional(),
    categoriaId: z.coerce.number().int().positive().optional(),
    ubicacionId: z.coerce.number().int().positive().optional(),
    fechaCierre: z.preprocess(
      (v) => (v === null || v === "" ? null : v ? new Date(String(v)) : undefined),
      z.union([z.date(), z.null()]).optional()
    ),
    estado: EstadoPublicacion.optional(),
    __scope: z.custom<Scope>().optional().default("all"),
  })
  .refine((d) => Object.keys(d).some((k) => !["id", "__scope"].includes(k)), {
    message: "Sin cambios",
  });

// ------------ actions ------------
export type MutState =
  | { ok: true; id: number }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createPublicationAction(
  _prev: MutState,
  formData: FormData
): Promise<MutState> {
  const userId = await getCurrentUserId();
  if (!userId) return { ok: false, error: "No autenticado" };

  // soporta alias de campos: fechaCierre | fecha_cierre
  const raw = {
    ...pick(formData, "titulo", "descripcion", "tipo", "categoriaId", "ubicacionId", "__scope"),
    remuneracion: String(formData.get("remuneracion") ?? formData.get("monto") ?? ""),
    fechaCierre: String(formData.get("fechaCierre") ?? formData.get("fecha_cierre") ?? ""),
    estado: String(formData.get("estado") ?? "ACTIVO"),
  };

  const parsed = createSchema.safeParse(raw);
  if (!parsed.success)
    return {
      ok: false,
      error: "Validación fallida",
      fieldErrors: parsed.error.flatten().fieldErrors as any,
    };

  const p = await prisma.publicacion.create({
    data: {
      titulo: parsed.data.titulo,
      descripcion: parsed.data.descripcion,
      remuneracion: parsed.data.remuneracion,
      tipo: parsed.data.tipo,
      estado: parsed.data.estado,
      fechaCierre: parsed.data.fechaCierre ?? undefined,
      usuarioId: userId,
      categoriaId: parsed.data.categoriaId,
      ubicacionId: parsed.data.ubicacionId,
    },
    select: { id: true },
  });

  revalidatePublications(parsed.data.__scope, p.id);
  return { ok: true, id: p.id };
}

export async function updatePublicationAction(
  _prev: MutState,
  formData: FormData
): Promise<MutState> {
  const userId = await getCurrentUserId();
  if (!userId) return { ok: false, error: "No autenticado" };

  const raw = {
    ...pick(formData, "id", "__scope"),
    titulo: String(formData.get("titulo") ?? ""),
    descripcion: String(formData.get("descripcion") ?? ""),
    remuneracion: String(formData.get("remuneracion") ?? ""),
    tipo: String(formData.get("tipo") ?? ""),
    categoriaId: String(formData.get("categoriaId") ?? ""),
    ubicacionId: String(formData.get("ubicacionId") ?? ""),
    fechaCierre: String(formData.get("fechaCierre") ?? formData.get("fecha_cierre") ?? ""),
    estado: String(formData.get("estado") ?? ""),
  };

  const parsed = updateSchema.safeParse(raw);
  if (!parsed.success)
    return {
      ok: false,
      error: "Validación fallida",
      fieldErrors: parsed.error.flatten().fieldErrors as any,
    };

  // ownership
  const existing = await prisma.publicacion.findUnique({
    where: { id: parsed.data.id },
    select: { usuarioId: true },
  });
  if (!existing) return { ok: false, error: "Publicación no encontrada" };
  if (existing.usuarioId !== userId) return { ok: false, error: "No autorizado" };

  const delta: any = {};
  if (parsed.data.titulo !== undefined) delta.titulo = parsed.data.titulo;
  if (parsed.data.descripcion !== undefined) delta.descripcion = parsed.data.descripcion;
  if (parsed.data.remuneracion !== undefined) delta.remuneracion = parsed.data.remuneracion;
  if (parsed.data.tipo !== undefined) delta.tipo = parsed.data.tipo;
  if (parsed.data.estado !== undefined) delta.estado = parsed.data.estado;
  if (parsed.data.categoriaId !== undefined) delta.categoriaId = parsed.data.categoriaId;
  if (parsed.data.ubicacionId !== undefined) delta.ubicacionId = parsed.data.ubicacionId;
  if (parsed.data.fechaCierre !== undefined)
    delta.fechaCierre = parsed.data.fechaCierre; // null para limpiar

  const upd = await prisma.publicacion.update({
    where: { id: parsed.data.id },
    data: delta,
    select: { id: true },
  });

  revalidatePublications(parsed.data.__scope, upd.id);
  return { ok: true, id: upd.id };
}

export async function deletePublicationAction(
  _prev: MutState,
  formData: FormData
): Promise<MutState> {
  const userId = await getCurrentUserId();
  if (!userId) return { ok: false, error: "No autenticado" };

  const id = Number(formData.get("id") ?? 0);
  const scope = (String(formData.get("__scope") || "all") as Scope);
  if (!Number.isInteger(id) || id <= 0) return { ok: false, error: "ID inválido" };

  const existing = await prisma.publicacion.findUnique({
    where: { id },
    select: { usuarioId: true },
  });
  if (!existing) return { ok: false, error: "Publicación no encontrada" };
  if (existing.usuarioId !== userId) return { ok: false, error: "No autorizado" };

  await prisma.publicacion.delete({ where: { id } });
  revalidatePublications(scope /* sin detalle ya que se eliminó */);
  return { ok: true, id };
}
