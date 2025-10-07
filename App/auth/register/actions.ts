"use server";

import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { registerSchema, type RegisterInput } from "../../../lib/zod/auth";

type FieldErrors = Partial<Record<keyof RegisterInput | "general", string[]>>;
export type RegisterActionResult =
  | { success: true; user: { id:number; rut:string; nombre:string; correo:string; region:string; ciudad:string; direccion:string; tipoUsuario:string }; ubicacion: { id:number; ciudad:string; comuna:string; region:string } }
  | { success: false; error: FieldErrors };

export async function registerUser(formData: FormData): Promise<RegisterActionResult> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = registerSchema.safeParse(raw);

  if (!parsed.success) return { success: false, error: parsed.error.flatten().fieldErrors as FieldErrors };

  const data = parsed.data as RegisterInput;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const hashed = await bcrypt.hash(data.contrasena, 10);

      const user = await tx.usuario.create({
        data: {
          rut: data.rut,
          nombre: data.fullName,
          correo: data.email,
          contrasena: hashed,
          region: data.region,
          ciudad: data.ciudad,
          direccion: data.direccion,
          tipoUsuario: "USUARIO",
        },
        select: {
          id: true, rut: true, nombre: true, correo: true,
          region: true, ciudad: true, direccion: true, tipoUsuario: true,
        },
      });

      const ubicacion = await tx.ubicacion.create({
        data: { ciudad: data.ciudad, comuna: data.comuna, region: data.region },
        select: { id: true, ciudad: true, comuna: true, region: true },
      });

      return { user, ubicacion };
    });

    return { success: true, user: result.user, ubicacion: result.ubicacion };
   } catch (e: any) {
    if (e?.code === "P2002") {
      if (e?.meta?.target?.includes("correo")) return { success:false, error:{ email:["Este correo ya está registrado"] } };
      if (e?.meta?.target?.includes("rut"))    return { success:false, error:{ rut:["Este RUT ya está registrado"] } };
    }
    return { success:false, error:{ general:["Error interno al registrar usuario"] } };
  }
}
