import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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