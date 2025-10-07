// app/publications/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import type { Prisma, TipoTrabajo } from "@prisma/client";

// DTO listo para PublicationCard
export type PublicationCardItem = {
  id: number;
  title: string;
  description: string;
  location?: string;           // "Comuna, Ciudad"
  salary?: string;             // CLP formateado
  jobType?: string;            // FULLTIME | PARTTIME | FREELANCE
  category?: string;           // nombre categoría
  author?: { nombre: string; tipoUsuario: string };
};

// Filtros
export type PublicationFilters = {
  ciudad?: string;
  comuna?: string;
  tipo?: TipoTrabajo | string;
  categoriaId?: number | number[];
  remuneracionMin?: number;
  remuneracionMax?: number;
};

const clp = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

export async function fetchActivePublications(
  filters: PublicationFilters = {}
): Promise<PublicationCardItem[]> {
  const where: Prisma.PublicacionWhereInput = {
    estado: "ACTIVO" as any, // si usas enum, importa EstadoPublicacion y usa EstadoPublicacion.ACTIVO
    ...(filters.tipo ? { tipo: filters.tipo as any } : {}),
    ...(filters.categoriaId
      ? {
          categoriaId: Array.isArray(filters.categoriaId)
            ? { in: filters.categoriaId }
            : filters.categoriaId,
        }
      : {}),
    ...(filters.remuneracionMin != null || filters.remuneracionMax != null
      ? {
          remuneracion: {
            ...(filters.remuneracionMin != null ? { gte: filters.remuneracionMin } : {}),
            ...(filters.remuneracionMax != null ? { lte: filters.remuneracionMax } : {}),
          },
        }
      : {}),
    ...(filters.ciudad || filters.comuna
      ? {
          // filtro por relación 1-a-1
          ubicacion: {
            is: {
              ...(filters.ciudad ? { ciudad: { contains: filters.ciudad } } : {}),
              ...(filters.comuna ? { comuna: { contains: filters.comuna } } : {}),
              // Nota: sensibilidad de mayúsculas depende del proveedor (ver citas).
            },
          },
        }
      : {}),
  };

  const rows = await prisma.publicacion.findMany({
    where,
    include: {
      usuario: { select: { nombre: true, tipoUsuario: true } },
      categoria: { select: { nombre: true } },
      ubicacion: { select: { ciudad: true, comuna: true } },
    },
    orderBy: { id: "desc" },
  });

  return rows.map((p) => ({
    id: p.id,
    title: p.titulo,
    description: p.descripcion,
    location: [p.ubicacion?.comuna, p.ubicacion?.ciudad].filter(Boolean).join(", "),
    salary: p.remuneracion != null ? clp.format(Number(p.remuneracion)) : undefined,
    jobType: p.tipo ?? undefined,
    category: p.categoria?.nombre,
    author: p.usuario ? { nombre: p.usuario.nombre, tipoUsuario: p.usuario.tipoUsuario } : undefined,
  }));
}
