// tests/auth.integration.test.ts

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs'; // ✅ 1. Importar bcrypt
import { loginSchema, registerSchema } from "../lib/zod/auth";

const prisma = new PrismaClient();

beforeEach(async () => {
  // ✅ 2. Limpieza más completa para evitar datos residuales entre tests
  await prisma.publicacion.deleteMany(); // Limpiar primero las tablas dependientes
  await prisma.usuario.deleteMany();
  await prisma.ubicacion.deleteMany();
  await prisma.categoria.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Flujo de autenticación", () => {
  it("debería registrar y luego loguear un usuario", async () => {
    const data = registerSchema.parse({
      rut: "12345678-9",
      nombre: "Juan Pérez",
      correo: "juan@test.com",
      contrasena: "password123",
      confirmarContrasena: "password123",
      tipo_usuario: "EMPLEADO",
    });

    // ✅ 3. Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(data.contrasena, 10);

    const { confirmarContrasena, ...userData } = data;
    await prisma.usuario.create({
      data: { ...userData, contrasena: hashedPassword },
    });

    const loginData = loginSchema.parse({
      correo: "juan@test.com",
      contrasena: "password123",
    });

    const user = await prisma.usuario.findUnique({
      where: { correo: loginData.correo },
    });

    expect(user).not.toBeNull();
    // ✅ 4. Comparar la contraseña del login con el hash guardado
    const passwordMatches = await bcrypt.compare(loginData.contrasena, user!.contrasena);
    expect(passwordMatches).toBe(true);
  });

  it("debería fallar login con contraseña incorrecta", async () => {
    // ✅ 5. Hashear la contraseña real al crear el usuario
    const realHashedPassword = await bcrypt.hash("passwordReal123", 10);
    await prisma.usuario.create({
      data: {
        rut: "98765432-1",
        nombre: "Ana Gómez",
        correo: "ana@test.com",
        contrasena: realHashedPassword,
        tipo_usuario: "EMPLEADOR",
      },
    });

    const loginData = loginSchema.parse({
      correo: "ana@test.com",
      contrasena: "wrongpassword",
    });

    const user = await prisma.usuario.findUnique({
      where: { correo: loginData.correo },
    });

    expect(user).not.toBeNull();
    // ✅ 6. La comparación con la contraseña incorrecta debe dar falso
    const passwordMatches = await bcrypt.compare(loginData.contrasena, user!.contrasena);
    expect(passwordMatches).toBe(false);
  });
});