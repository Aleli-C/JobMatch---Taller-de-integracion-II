// app/auth/login/actions.ts
"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { signJWT } from "@/lib/jwt";
import { prisma } from "@/prisma/prisma";
import { loginSchema } from "@/lib/zod/auth";
import type { LoginInput } from "@/lib/zod/auth";
import { sessionConfig } from "@/lib/session"; //  importamos la config centralizada

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

    // Si la contraseña es válida
    const { contraseña, ...userWithoutPassword } = user;

    // Crear token JWT
    const token = signJWT({
      id: user.id_Usuario,
      correo: user.correo,
      tipo: user.tipo_usuario,
    });

    // Guardar en cookie usando config centralizada
    cookies().set(sessionConfig.name, token, sessionConfig.options);

    return { success: true, user: userWithoutPassword };
  } catch (err) {
    console.error(err);
    return { error: { general: ["Error interno al iniciar sesión"] } };
  }
}

