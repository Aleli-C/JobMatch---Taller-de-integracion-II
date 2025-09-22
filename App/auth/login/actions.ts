// app/auth/login/actions.ts
"use server";

import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { loginSchema } from "../../../lib/zod/auth";
import { createSession } from "../../../lib/session";
import { redirect } from "next/navigation";

export type LoginActionResult = { error: Record<string, string[]> } | void;

export async function loginUser(formData: FormData): Promise<LoginActionResult> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const { correo, contrasena } = parsed.data;
  const user = await prisma.usuario.findUnique({ where: { correo } });
  if (!user) return { error: { correo: ["Correo no registrado"] } };

  const ok = await bcrypt.compare(contrasena, user.contrasena);
  if (!ok) return { error: { contraseña: ["Contraseña incorrecta"] } };

  await createSession({ sub: user.id, correo: user.correo, role: user.tipoUsuario });
  redirect("/"); // no retorna
}
