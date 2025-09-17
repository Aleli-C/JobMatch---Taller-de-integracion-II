"use server";

import bcrypt from "bcryptjs";
import { prisma } from "../../../prisma/prisma.schema";
import { registerSchema } from "../../../lib/zod/auth";
import type { RegisterInput } from "../../../lib/zod/auth";

export async function registerUser(formData: FormData) {
  // Convertir FormData en objeto plano
  const data = Object.fromEntries(formData.entries());

  // Validar con Zod
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const userData: RegisterInput = parsed.data;

  // Hashear contraseña
  const hashedPassword = await bcrypt.hash(userData.contraseña, 10);

  try {
    // Guardar en DB con Prisma
    const newUser = await prisma.usuario.create({
      data: {
        rut: userData.rut,
        nombre: userData.nombre,
        correo: userData.correo,
        contraseña: hashedPassword,
        tipo_usuario: userData.tipo_usuario,
        ubicacion: userData.ubicacion ?? null,
      },
      select: {
        id_Usuario: true,
        rut: true,
        nombre: true,
        correo: true,
        tipo_usuario: true,
        ubicacion: true,
      },
    });

    return { success: true, user: newUser };
  } catch (err: any) {
    if (err.code === "P2002") {
      return { error: { correo: ["Este correo ya está registrado"] } };
    }
    console.error(err);
    return { error: { general: ["Error interno al registrar usuario"] } };
  }
}
