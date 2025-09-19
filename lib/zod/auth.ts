import { z } from "zod";

// --- Función para validar RUT chileno con DV ---
function validarRut(rut: string): boolean {
  rut = rut.replace(/\./g, "").replace(/-/g, "").toLowerCase();
  const cuerpo = rut.slice(0, -1);
  const dv = rut.slice(-1);

  if (!/^\d+$/.test(cuerpo)) return false;

  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = 11 - (suma % 11);
  const dvEsperado = resto === 11 ? "0" : resto === 10 ? "k" : resto.toString();

  return dv === dvEsperado;
}

// --- RUT schema ---
export const rutSchema = z
  .string()
  .regex(/^\d{7,8}-[\dkK]$/, "El RUT no tiene un formato válido (ej: 12345678-9)")
  .refine((rut) => validarRut(rut), {
    message: "RUT inválido, dígito verificador incorrecto",
  });

// --- Login ---
export const loginSchema = z.object({
  correo: z.string().email("Debe ser un correo válido"),
  contraseña: z.string().min(6, "La contraseña debe tener mínimo 6 caracteres"),
});

// --- Registro ---
export const registerSchema = z
  .object({
    rut: rutSchema,
    nombre: z.string().min(2, "El nombre es demasiado corto"),
    correo: z.string().email("Debe ser un correo válido"),
    contraseña: z.string().min(6, "La contraseña debe tener mínimo 6 caracteres"),
    confirmarContraseña: z.string(),
    tipo_usuario: z.enum(["admin", "cliente", "proveedor"]), // ajusta a tus valores reales
    ubicacion: z.date().optional(),
  })
  .refine((data) => data.contraseña === data.confirmarContraseña, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarContraseña"],
  });

// --- Reset por correo ---
export const requestResetSchema = z.object({
  correo: z.string().email("Debe ser un correo válido"),
});

// --- Reset con token ---
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "El token es requerido"),
    contraseña: z.string().min(6, "La contraseña debe tener mínimo 6 caracteres"),
    confirmarContraseña: z.string(),
  })
  .refine((data) => data.contraseña === data.confirmarContraseña, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarContraseña"],
  });

// ---- Tipos inferidos ----
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RequestResetInput = z.infer<typeof requestResetSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
