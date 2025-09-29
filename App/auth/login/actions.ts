"use server";

import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { loginSchema, type LoginInput } from "../../../lib/zod/auth";
import { createSession } from "../../../lib/session";
import { redirect } from "next/navigation";

export type LoginActionState = {
  ok: boolean;
  message?: string;
  errors?: {
    correo?: string[];
    contrasena?: string[];
    general?: string[];
  };
};

export async function loginUser(
  prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  // Extraer datos del FormData
  const data = Object.fromEntries(formData.entries());

  // Validar datos con Zod
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { correo, contrasena }: LoginInput = parsed.data;

  try {
    // Buscar usuario en la base de datos
    const user = await prisma.usuario.findUnique({
      where: { correo },
      select: {
        id: true,
        nombre: true,
        correo: true,
        contrasena: true,
        tipoUsuario: true,
      },
    });

    if (!user) {
      return {
        ok: false,
        errors: {
          correo: ["Correo no registrado"],
        },
      };
    }

    // Verificar contraseña hasheada
    const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
    if (!isPasswordValid) {
      return {
        ok: false,
        errors: {
          contrasena: ["Contraseña incorrecta"],
        },
      };
    }

    // Crear sesión con los datos del usuario
    await createSession({
      sub: user.id,
      correo: user.correo,
      role: user.tipoUsuario,
    });
  } catch (error) {
    console.error("Error en login:", error);
    return {
      ok: false,
      errors: {
        general: ["Error interno del servidor. Intenta nuevamente."],
      },
    };
  }

  // Redirigir al home después del login exitoso
  redirect("/");
}
