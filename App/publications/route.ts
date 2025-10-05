// app/api/publications/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaPublicationRepository } from "@/lib/repositories/prisma-publication-repository";
import { getSession } from "@/lib/session"; // <-- Cambia el import

const prisma = new PrismaClient();
const publicationRepo = new PrismaPublicationRepository(prisma);

console.log("API /publications cargada");

// -----------------------------
// GET /publications/meta
// -----------------------------
export async function GET() {
  try {
    const categorias = await prisma.categoria.findMany();
    const ubicaciones = await prisma.ubicacion.findMany();
    return NextResponse.json({ categorias, ubicaciones });
  } catch (err) {
    console.error("Error obteniendo meta:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// -----------------------------
// POST /publications
// -----------------------------
export async function POST(req: Request) {
  try {
    // Obtener usuario de la sesión
    const user = await getSession(); // <-- Usa getSession
    if (!user) {
      return NextResponse.json({ error: "No estás logueado" }, { status: 401 });
    }

    const data = await req.json();

    // Validar campos obligatorios
    const requiredFields = ["titulo", "descripcion", "remuneracion", "tipo", "idUbicacion", "idCategoria"];
    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null || data[field] === "") {
        return NextResponse.json(
          { error: `Falta el campo obligatorio: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validar entidades relacionadas
    const valid = await publicationRepo.validateRelatedEntities(
      data.idUbicacion,
      data.idCategoria
    );
    if (!valid) {
      return NextResponse.json(
        { error: "Ubicación o categoría inválida" },
        { status: 400 }
      );
    }

    // Crear publicación usando el id del usuario de la sesión
    const publication = await publicationRepo.create({
      idUsuario: Number(user.sub), // <-- Cambia a user.sub si tu sesión usa ese campo
      titulo: data.titulo,
      descripcion: data.descripcion,
      remuneracion: data.remuneracion,
      tipo: data.tipo,
      idUbicacion: data.idUbicacion,
      idCategoria: data.idCategoria,
      fechaCierre: data.fechaCierre || null,
    });

    return NextResponse.json(publication, { status: 201 });
  } catch (err) {
    console.error("Error en POST /publications:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
