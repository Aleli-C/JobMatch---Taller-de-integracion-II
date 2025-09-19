// src/services/publicacionService.ts
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

/* ====== CREATE ====== */
export async function crearPublicacion(data: Prisma.PublicacionCreateInput) {
  return prisma.publicacion.create({
    data,
    include: {
      usuario: true,
      ubicacion: true,
      categoria: true,
    },
  })
}

/* ====== READ ====== */
export async function obtenerPublicaciones() {
  return prisma.publicacion.findMany({
    include: {
      usuario: true,
      ubicacion: true,
      categoria: true,
    },
    orderBy: { fechaPublicacion: 'desc' },
  })
}

export async function obtenerPublicacionPorId(id: number) {
  return prisma.publicacion.findUnique({
    where: { id },
    include: {
      usuario: true,
      ubicacion: true,
      categoria: true,
      postulaciones: true,
      guardados: true,
      reportes: true,
      historial: true,
    },
  })
}

/* ====== UPDATE ====== */
export async function actualizarPublicacion(
  id: number,
  data: Prisma.PublicacionUpdateInput
) {
  return prisma.publicacion.update({
    where: { id },
    data,
  })
}

/* ====== DELETE ====== */
export async function eliminarPublicacion(id: number) {
  return prisma.publicacion.delete({
    where: { id },
  })
}
