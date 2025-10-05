// lib/getSessionUser.ts
import { cookies } from "next/headers";
import { verifyJWT } from "./jwt";
import { prisma } from "@/lib/prisma";

type SessionPayload = {
  id: number;
  correo: string;
  tipoUsuario: "USUARIO" | "ADMIN";
  iat: number;
  exp: number;
};

export async function getSessionUser() {
  try {
    // Next.js 14+: cookies() es asíncrono
    const cookieStore = await cookies();

    const token = cookieStore.get("authToken")?.value;
    if (!token) return null;

    // Verificar el JWT
    const decoded = await verifyJWT<SessionPayload>(token);
    if (!decoded) return null;

    // Buscar usuario en la BD para validar existencia o cambios de rol
    const user = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        correo: true,
        nombre: true,
        tipoUsuario: true,
        region: true,
        ciudad: true,
        direccion: true,
      },
    });

    // Si el usuario fue eliminado o no coincide, no hay sesión válida
    if (!user) return null;

    return user;
  } catch (error) {
    console.error("Error en getSessionUser:", error);
    return null;
  }
}
