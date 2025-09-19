// app/auth/login/actions.ts
"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { signJWT } from "@/lib/jwt";
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

    // Compara de forma segura la contraseña que envía el usuario con el hash guardado en la base de datos. Esto evita exponer el hash.
    const isPasswordValid = await bcrypt.compare(
      loginData.contraseña,
      user.contraseña
    );

    if (!isPasswordValid) {
      return { error: { contraseña: ["Contraseña incorrecta"] } };
    }

    // Si la contraseña es válida
    const { contraseña, ...userWithoutPassword } = user;

    //Creación de Cookie: Se crea un token JWT que se guarda en una cookie 
    // Crear token JWT
    const token = signJWT({
      id: user.id_Usuario,
      correo: user.correo,
      tipo: user.tipo_usuario,
    });

    // Guardar en cookie httpOnly La cookie no puede ser leída por JavaScript en el navegador, lo que te protege de ataques.
    cookies().set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", //protección contra ataques CSRF
      path: "/",
    });

    return { success: true, user: userWithoutPassword };
  } catch (err) {
    console.error(err);
    return { error: { general: ["Error interno al iniciar sesión"] } };
  }
}
