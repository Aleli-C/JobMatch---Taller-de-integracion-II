//app/publications/publications_own/actions.ts
"use server";

import { prisma } from "@/lib/prisma";

const FAKE_USER_ID = 1;

// Función helper para convertir Decimals a números
function convertDecimalFields(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => convertDecimalFields(item));
  }
  
  if (typeof obj === 'object') {
    const converted: any = {};
    for (const key in obj) {
      const value = obj[key];
      
      // Si es un objeto Decimal de Prisma, convertirlo a número
      if (value && typeof value === 'object' && typeof value.toNumber === 'function') {
        converted[key] = value.toNumber();
      } 
      // Si es un objeto Date, mantenerlo como string ISO para serialización
      else if (value instanceof Date) {
        converted[key] = value.toISOString();
      }
      // Si es otro objeto, recursión
      else if (value && typeof value === 'object' && !Array.isArray(value)) {
        converted[key] = convertDecimalFields(value);
      } 
      // Otros valores se mantienen igual
      else {
        converted[key] = value;
      }
    }
    return converted;
  }
  
  return obj;
}

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
        categoria: {
          select: {
            nombre: true,
            icono: true
          }
        },
        ubicacion: {
          select: {
            ciudad: true,
            region: true
          }
        }
      },
      orderBy: { id: "desc" },
    });

    // Convertir todos los campos Decimal a números antes de devolver
    return convertDecimalFields(publications);
  } catch (error) {
    console.error("Error en GetPublications:", error);
    return [];
  }
}