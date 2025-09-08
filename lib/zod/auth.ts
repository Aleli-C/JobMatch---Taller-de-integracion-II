import { z } from "zod";

// Validador de RUT simple (ejemplo básico, se puede mejorar con regex chileno)
const rutRegex = /^[0-9]+-[0-9kK]{1}$/;
export const rutSchema = z
  .string()
  .regex(rutRegex, "El RUT no tiene un formato válido");

// Login → usa correo + contraseña
export const loginSchema = z.object({
  correo: z.string().email("Debe ser un correo válido"),
  contrasena: z.string().min(6, "La contraseña debe tener mínimo 6 caracteres"),
});

// Registro
export const registerSchema = z
  .object({
    rut: rutSchema,
    nombre: z.string().min(2, "El nombre es demasiado corto"),
    correo: z.string().email("Debe ser un correo válido"),
    contrasena: z.string().min(6, "La contraseña debe tener mínimo 6 caracteres"),
    confirmarContrasena: z.string(),
    
    // Aquí está el cambio:
    tipo_usuario: z.enum(["EMPLEADOR", "EMPLEADO"]), // ✅ ¡Corregido!

    ubicacion: z.date().optional(),
  })
  .refine((data) => data.contrasena === data.confirmarContrasena, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarContrasena"],
  });


// Reset con token
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "El token es requerido"),
    contrasena: z.string().min(6, "La contraseña debe tener mínimo 6 caracteres"),
    confirmarContrasena: z.string(),
  })
  .refine((data) => data.contrasena === data.confirmarContrasena, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarContrasena"],
  });

// ---- Tipos inferidos ----
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RequestResetInput = z.infer<typeof requestResetSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
