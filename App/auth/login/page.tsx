"use client";

import React, { useState } from "react";
import { z } from "zod";
import Button from "../../../components/button";

// Schema de validación con Zod
const loginSchema = z.object({
  email: z.string().email("Por favor ingresa un email válido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginForm, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error específico cuando el usuario empiece a escribir
    if (errors[name as keyof LoginForm]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validar datos con Zod
      const validatedData = loginSchema.parse(formData);

      // Simular login exitoso (aquí irían las llamadas a la API)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("¡Inicio de sesión exitoso! Redirigiendo...");
      // Aquí rediriges al dashboard
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Formatear errores de Zod
        const formattedErrors: Partial<Record<keyof LoginForm, string>> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0] as keyof LoginForm] = err.message;
          }
        });
        setErrors(formattedErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: "google" | "facebook") => {
    alert(
      `Iniciar sesión con ${
        provider === "google" ? "Google" : "Facebook"
      } - Función por implementar`
    );
  };

  const handleForgotPassword = () => {
    alert("Redirigir a recuperación de contraseña - Función por implementar");
  };

  const handleRegister = () => {
    alert("Redirigir a registro - Función por implementar");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo + Nombre */}
          <div className="flex items-center space-x-2">
            <img
              src="/JobMatch.png"
              alt="JobMatch Logo"
              className="h-10 w-12"
            />
            <span className="text-2xl font-bold text-blue-600">JobMatch</span>
          </div>

          {/* Botón Registro */}
          <Button variant="outline" size="sm" onClick={handleRegister}>
            Registro
          </Button>
        </div>
      </header>

      {/* Contenido Principal */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-8">
        <div className="w-full max-w-md">
          {/* Formulario */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Inicio de Sesión
              </h2>
              <p className="text-gray-600 text-sm">
                ¡Bienvenido de nuevo! Introduce tus datos.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Correo Electrónico */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="tu@ejemplo.com"
                  className={`w-full px-3 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-gray-100 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Contraseña */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full px-3 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-gray-100 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Botón de Login */}
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Iniciando Sesión..." : "Iniciar Sesión"}
              </Button>
            </form>

            {/* Separador */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">O</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Link olvidaste contraseña */}
            <div className="text-center mb-4">
              <button
                onClick={handleForgotPassword}
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Link a Registro */}
            <p className="text-center text-sm text-gray-600">
              ¿No tienes cuenta aún?{" "}
              <button
                onClick={handleRegister}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Regístrate!
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
