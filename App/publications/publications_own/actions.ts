"use server";

import { prisma } from "@/lib/prisma";

// Simular usuario logeado → usar id 1 o 3
const FAKE_USER_ID = 1;

export async function GetPublications(userId: number = FAKE_USER_ID) {
  try {
    const publications = await prisma.publicacion.findMany({
      where: { usuarioId: userId }, // nombre correcto en tu schema
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
    throw new Error("No se pudieron obtener las publicaciones");
  }
}
