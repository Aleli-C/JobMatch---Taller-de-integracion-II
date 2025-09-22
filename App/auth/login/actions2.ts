"use server";

import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { loginSchema } from "../../../lib/zod/auth";
import type { LoginInput } from "../../../lib/zod/auth";
import { createSession } from "../../../lib/session"; // ← usa createSession

export async function loginUser(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const { correo, contrasena }: LoginInput = parsed.data;

  try {
    const user = await prisma.usuario.findUnique({
      where: { correo },
      select: { id: true, nombre: true, correo: true, contrasena: true, tipoUsuario: true },
    });
    if (!user) return { error: { correo: ["Correo no registrado"] } };

    const ok = await bcrypt.compare(contrasena, user.contrasena);
    if (!ok) return { error: { contrasena: ["Credenciales inválidas"] } };

    await createSession({ sub: user.id, correo: user.correo, role: user.tipoUsuario });

    const { contrasena: _omit, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  } catch (err) {
    console.error(err);
    return { error: { general: ["Error interno al iniciar sesión"] } };
  }
}
