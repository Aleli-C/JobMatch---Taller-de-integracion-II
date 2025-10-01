"use server";

import { prisma } from "@/lib/prisma";

const FAKE_USER_ID = 1;

export async function GetPublications(userId: number = FAKE_USER_ID) {
  try {
    const publications = await prisma.publicacion.findMany({
      where: { usuarioId: userId },
      select: {
        id: true,
        titulo: true,
        descripcion: true,
        icono: true,
        tipo: true,
        estado: true,
        remuneracion: true,
        fechaPublicacion: true,
        fechaCierre: true,
      },
      orderBy: { id: "desc" },
    });

    return publications;
  } catch (error) {
    console.error("Error en GetPublications:", error);
    return [];
  }
}
