"use server";

import bcrypt from "bcryptjs";
import { prisma } from "../../../prisma/prisma";
import { loginSchema } from "../../../lib/zod/auth";
import type { LoginInput } from "../../../lib/zod/auth";

export async function loginUser(formData: FormData) {
  // Convertir FormData en objeto plano
  const data = Object.fromEntries(formData.entries());

  // Validar con Zod
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const loginData: LoginInput = parsed.data;

  try {
    // Buscar usuario por correo
    const user = await prisma.usuario.findUnique({
      where: { correo: loginData.correo },
    });

    if (!user) {
      return { error: { correo: ["Correo no registrado"] } };
    }

    // Comparar contraseña
    const isPasswordValid = await bcrypt.compare(
      loginData.contraseña,
      user.contraseña
    );

    if (!isPasswordValid) {
      return { error: { contraseña: ["Contraseña incorrecta"] } };
    }

    // Retornar usuario (sin contraseña)
    const { contraseña, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  } catch (err) {
    console.error(err);
    return { error: { general: ["Error interno al iniciar sesión"] } };
  }
}
