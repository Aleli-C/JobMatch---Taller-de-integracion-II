"use server";

import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { z } from "zod";

// Validación personalizada para RUT chileno
const rutRegex = /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]{1}$/;

const validateRut = (rut: string): boolean => {
  if (!rutRegex.test(rut)) return false;

  const cleanRut = rut.replace(/\./g, "").replace("-", "");
  const rutNumber = cleanRut.slice(0, -1);
  const verifier = cleanRut.slice(-1).toUpperCase();

  let sum = 0;
  let multiplier = 2;

  for (let i = rutNumber.length - 1; i >= 0; i--) {
    sum += parseInt(rutNumber[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = sum % 11;
  const expectedVerifier =
    remainder === 0 ? "0" : remainder === 1 ? "K" : (11 - remainder).toString();

  return verifier === expectedVerifier;
};

// Schema de validación actualizado
const registerSchema = z
  .object({
    rut: z
      .string()
      .min(1, "El RUT es requerido")
      .refine(validateRut, "RUT inválido. Formato: 11.111.111-0"),
    fullName: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(100, "El nombre no puede exceder 100 caracteres"),
    email: z.string().email("Por favor ingresa un email válido"),
    contrasena: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
      ),
    confirmcontrasena: z.string(),
    region: z.string().min(1, "Seleccione una región"),
    ciudad: z
      .string()
      .min(2, "La ciudad debe tener al menos 2 caracteres")
      .max(60, "La ciudad no puede exceder 60 caracteres"),
    direccion: z
      .string()
      .min(5, "La dirección debe tener al menos 5 caracteres")
      .max(255, "La dirección no puede exceder 255 caracteres"),
  })
  .refine((data) => data.contrasena === data.confirmcontrasena, {
    message: "Las contraseñas no coinciden",
    path: ["confirmcontrasena"],
  });

type RegisterInput = z.infer<typeof registerSchema>;

export async function registerUser(formData: FormData) {
  const raw = Object.fromEntries(formData.entries()) as Record<string, string>;

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const data: RegisterInput = parsed.data;

  try {
    const hashed = await bcrypt.hash(data.contrasena, 10);

    const newUser = await prisma.usuario.create({
      data: {
        rut: data.rut,
        nombre: data.fullName,
        correo: data.email,
        contrasena: hashed,
        region: data.region,
        ciudad: data.ciudad,
        direccion: data.direccion,
        tipoUsuario: "EMPLEADOR",
      },
      select: {
        id: true,
        rut: true,
        nombre: true,
        correo: true,
        region: true,
        ciudad: true,
        direccion: true,
        tipoUsuario: true,
      },
    });

    return { success: true, user: newUser };
  } catch (err: any) {
    if (err?.code === "P2002") {
      if (err?.meta?.target?.includes("correo")) {
        return { error: { email: ["Este correo ya está registrado"] } };
      }
      if (err?.meta?.target?.includes("rut")) {
        return { error: { rut: ["Este RUT ya está registrado"] } };
      }
    }
    console.error(err);
    return { error: { general: ["Error interno al registrar usuario"] } };
  }
}
