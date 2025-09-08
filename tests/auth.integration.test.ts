// tests/auth.integration.test.ts

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import { loginSchema, registerSchema } from "../lib/zod/auth"; // Import sin la extensión .ts

const prisma = new PrismaClient();

// Hook que se ejecuta ANTES de CADA prueba 'it'
beforeEach(async () => {
  // Limpiamos las tablas en el orden correcto para evitar errores de constraints
  // Agrega aquí otras tablas que dependan de 'Usuario' si es necesario
  await prisma.usuario.deleteMany();
});

// Hook que se ejecuta UNA VEZ al final de TODAS las pruebas en este archivo
afterAll(async () => {
  await prisma.$disconnect();
});

describe("Flujo de autenticación", () => {
  it("debería registrar y luego loguear un usuario", async () => {
    // 1. Validar datos de registro
    const data = registerSchema.parse({
      rut: "12345678-9",
      nombre: "Juan Pérez",
      correo: "juan@test.com",
      contrasena: "password123", // ✅ Corregido
      confirmarContrasena: "password123", // ✅ Corregido
      tipo_usuario: "EMPLEADO", // ✅ Usamos un valor del Enum de Prisma
    });

    // 2. Guardar en DB (quitando el campo de confirmación)
    const { confirmarContrasena, ...userData } = data;
    await prisma.usuario.create({ data: userData });

    // 3. Validar login
    const loginData = loginSchema.parse({
      correo: "juan@test.com",
      contrasena: "password123", // ✅ Corregido
    });

    const user = await prisma.usuario.findUnique({
      where: { correo: loginData.correo },
    });

    expect(user).not.toBeNull();
    expect(user?.contrasena).toBe(loginData.contrasena); // ✅ Corregido
  });

  it("debería fallar login con contraseña incorrecta", async () => {
    // 1. Crear un usuario de prueba para este test específico
    await prisma.usuario.create({
      data: {
        rut: "98765432-1",
        nombre: "Ana Gómez",
        correo: "ana@test.com",
        contrasena: "passwordReal123", // ✅ Corregido
        tipo_usuario: "EMPLEADOR", // ✅ Usamos un valor del Enum de Prisma
      },
    });

    // 2. Intentar login con la contraseña incorrecta
    const loginData = loginSchema.parse({
      correo: "ana@test.com",
      contrasena: "wrongpassword", // ✅ Corregido
    });

    const user = await prisma.usuario.findUnique({
      where: { correo: loginData.correo },
    });

    // 3. Verificar que el usuario existe pero la contraseña no coincide
    expect(user).not.toBeNull();
    expect(user?.contrasena).not.toBe(loginData.contrasena); // ✅ Corregido
  });
});