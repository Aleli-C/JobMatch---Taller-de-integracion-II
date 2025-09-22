"use server";

import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { registerSchema, type RegisterInput } from "../../../lib/zod/auth";

export async function registerUser(formData: FormData) {
  const raw = Object.fromEntries(formData.entries()) as Record<string, string>;

  // Normaliza claves con acento -> sin acento
  if (raw["contraseña"] && !raw["contrasena"]) raw["contrasena"] = raw["contraseña"];

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const data: RegisterInput = parsed.data;

  try {
    const hashed = await bcrypt.hash(data.contrasena, 10);

    const newUser = await prisma.usuario.create({
      data: {
        rut: data.rut,
        nombre: data.nombre,
        correo: data.correo,
        contrasena: hashed,
        tipoUsuario: data.tipo_usuario,        // map snake → camel
        direccion: data.direccion ?? undefined,
      },
      select: {
        id: true,
        rut: true,
        nombre: true,
        correo: true,
        tipoUsuario: true,
        direccion: true,
      },
    });

    return { success: true, user: newUser };
  } catch (err: any) {
    if (err?.code === "P2002" && err?.meta?.target?.includes("correo")) {
      return { error: { correo: ["Este correo ya está registrado"] } };
    }
    console.error(err);
    return { error: { general: ["Error interno al registrar usuario"] } };
  }
}
