// lib/history.ts  (reemplazo completo del bloque de publicaciones)
import { prisma } from "@/lib/prisma";
import type { PublicationStatus, PublicationType } from "@/lib/types/publication";
import type { PublicationView, TopicView } from "@/components/ProfileHistory";

export async function GetHistoryProfileUser(userId: number): Promise<{
  forumHistory: TopicView[];
  publications: PublicationView[];
}> {
  // -------- Foro (tal como lo tenías) --------
  const foros = await prisma.foro.findMany({
    where: { usuarioId: userId },
    orderBy: { fecha: "desc" },
    include: { _count: { select: { respuestas: true } } },
  });

  const forumHistory: TopicView[] = foros.map((f) => ({
    title: f.titulo,
    author: undefined,
    time: (f.fecha instanceof Date ? f.fecha : new Date(f.fecha)).toISOString(),
    replies: f._count.respuestas ?? 0,
    content: f.consulta ?? undefined,
  }));

  // -------- Publicaciones (corregido a tu schema) --------
  const pubs = await prisma.publicacion.findMany({
    where: { usuarioId: userId },
    orderBy: { fechaPublicacion: "desc" },
    select: {
      id: true,                 // <- era idPublicacion en tu tipo de dominio
      usuarioId: true,          // <- era idUsuario
      titulo: true,
      descripcion: true,
      remuneracion: true,       // Decimal
      tipo: true,               // Prisma enum TipoTrabajo
      estado: true,             // Prisma enum EstadoPublicacion
      fechaPublicacion: true,
      fechaCierre: true,
      ubicacionId: true,        // <- era idUbicacion
      categoriaId: true,        // <- era idCategoria
    },
  });

  const publications: PublicationView[] = pubs.map((p) => {
    // Decimal → number
    const remuneracion =
      typeof (p as any).remuneracion === "object" &&
      typeof (p as any).remuneracion?.toNumber === "function"
        ? (p as any).remuneracion.toNumber()
        : (p as any).remuneracion;

    const fp =
      p.fechaPublicacion instanceof Date
        ? p.fechaPublicacion
        : new Date(p.fechaPublicacion as any);

    const fc =
      p.fechaCierre != null
        ? p.fechaCierre instanceof Date
          ? p.fechaCierre
          : new Date(p.fechaCierre as any)
        : undefined;

    return {
      // mapeo a los nombres que espera tu UI (PublicationView en ProfileHistory)
      idPublicacion: p.id,
      idUsuario: p.usuarioId,
      titulo: p.titulo,
      descripcion: p.descripcion ?? "",
      remuneracion: remuneracion as number,
      // tus enums de UI son strings compatibles, casteamos:
      tipo: p.tipo as unknown as PublicationType,
      estado: p.estado as unknown as PublicationStatus,
      fechaPublicacion: fp.toISOString(),
      fechaCierre: fc?.toISOString(),
      idUbicacion: p.ubicacionId,
      idCategoria: p.categoriaId,
    };
  });

  return { forumHistory, publications };
}
