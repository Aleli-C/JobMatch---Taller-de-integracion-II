// app/auth/login/actions.ts
"use server";

import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { loginSchema } from "../../../lib/zod/auth";
import { createSession } from "../../../lib/session";
import { redirect } from "next/navigation";

export type LoginActionState = {
  ok: boolean;
  errors?: { correo?: string[]; contrasena?: string[]; general?: string[] };
};

export async function loginUser(_prev: LoginActionState, formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return { ok: false, errors: parsed.error.flatten().fieldErrors };

  const { correo, contrasena } = parsed.data;

  const user = await prisma.usuario.findUnique({
    where: { correo },
    select: { id: true, correo: true, contrasena: true, tipoUsuario: true },
  });
  if (!user) return { ok: false, errors: { correo: ["Correo no registrado"] } };

  const ok = await bcrypt.compare(contrasena, user.contrasena);
  if (!ok)
    return { ok: false, errors: { contrasena: ["Credenciales inválidas"] } };

  await createSession({
    sub: String(user.id),
    correo: user.correo,
    role: user.tipoUsuario,
  });
  redirect("/"); // NO try/catch, NO return después. :contentReference[oaicite:1]{index=1}
}
