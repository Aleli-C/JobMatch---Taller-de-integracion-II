// lib/publicaciones/aceptarPublicacion.ts
import { PrismaClient, Publicacion, EstadoPublicacion } from "@prisma/client";

export type AceptarPublicacionInput =
  | { publicacionId: number; aprobadorId: number; motivo?: string }
  | { publicacion: Publicacion; aprobadorId: number; motivo?: string };

export type AceptarPublicacionResult = {
  id: number;
  estadoAnterior: EstadoPublicacion;
  estadoNuevo: EstadoPublicacion; // esperado: ACTIVO
  fechaPublicacion: Date;
  mensaje: string;
};

export async function aceptarPublicacion(
  prisma: PrismaClient,
  input: AceptarPublicacionInput
): Promise<AceptarPublicacionResult> {
  const aprobadorId =
    "publicacionId" in input ? input.aprobadorId : input.aprobadorId;

  const id =
    "publicacionId" in input
      ? input.publicacionId
      : (input.publicacion?.id as number);

  if (!id) throw new Error("ID de publicación inválido.");

  return prisma.$transaction(async (tx) => {
    // Traemos estado y dueño siempre desde DB para evitar desincronización.
    const actual = await tx.publicacion.findUnique({
      where: { id },
      select: { id: true, usuarioId: true, estado: true, fechaPublicacion: true },
    });

    if (!actual) {
      throw new Error("Publicación no encontrada.");
    }

    // Permisos básicos: sólo el dueño puede aprobar (ajusta si tendrás rol admin/mod).
    if (actual.usuarioId !== aprobadorId) {
      throw new Error("No autorizado para aprobar esta publicación.");
    }

    // Si ya está activa → no-op (idempotente).
    if (actual.estado === "ACTIVO") {
      return {
        id: actual.id,
        estadoAnterior: actual.estado,
        estadoNuevo: actual.estado,
        fechaPublicacion: actual.fechaPublicacion ?? new Date(),
        mensaje: "La publicación ya estaba activa.",
      };
    }

    // Permitimos sólo INACTIVO -> ACTIVO. (CERRADO -> ACTIVO: decide tu negocio)
    if (actual.estado !== "INACTIVO") {
      throw new Error(
        `Transición no permitida: ${actual.estado} -> ACTIVO.`
      );
    }

    const ahora = new Date();
    const updated = await tx.publicacion.update({
      where: { id: actual.id },
      data: {
        estado: "ACTIVO",
        // Si no tenía, fijamos ahora; si ya había, la respetamos.
        fechaPublicacion: actual.fechaPublicacion ?? ahora,
      },
      select: { id: true, estado: true, fechaPublicacion: true },
    });

    return {
      id: updated.id,
      estadoAnterior: actual.estado,
      estadoNuevo: updated.estado,
      fechaPublicacion: updated.fechaPublicacion!,
      mensaje: "Publicación aprobada y activada.",
    };
  });
}
