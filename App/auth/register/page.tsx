"use client";

import React, { useState } from "react";
import { z } from "zod";
import Button from "../../../components/button";

// Schema de validación con Zod
const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre no puede exceder 50 caracteres"),
    email: z.string().email("Por favor ingresa un email válido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const [formData, setFormData] = useState<RegisterForm>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterForm, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error específico cuando el usuario empiece a escribir
    if (errors[name as keyof RegisterForm]) {
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
      const validatedData = registerSchema.parse(formData);

      // Simular registro exitoso (aquí irían las llamadas a la API)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("¡Cuenta creada exitosamente! Redirigiendo...");
      // Aquí rediriges al login o dashboard
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Formatear errores de Zod
        const formattedErrors: Partial<Record<keyof RegisterForm, string>> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0] as keyof RegisterForm] = err.message;
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header separado con logo y botón de iniciar sesión */}
      <header className="w-full py-4 px-8 bg-white">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo + JobMatch */}
          <div className="flex items-center space-x-2">
            <img src="/JobMatch.png" alt="JobMatch Logo" className="h-8 w-10" />
            <span className="text-xl font-bold text-blue-600">JobMatch</span>
          </div>

          {/* Botón Iniciar Sesión */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("Redirigir a Login")}
          >
            Iniciar Sesión
          </Button>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="flex justify-center items-start px-4 py-8">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex min-h-[600px]">
            {/* Lado izquierdo - Formulario */}
            <div className="flex-1 p-8 flex items-center">
              <div className="w-full max-w-sm mx-auto">
                {/* Título del formulario */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    Crea Tu Cuenta
                  </h2>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    JobMatch
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Únase a nosotros hoy para descubrir oportunidades laborales
                    espontáneas diseñadas para usted.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nombre Completo */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.fullName
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

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
                      placeholder="john.doe@ejemplo.com"
                      className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.email
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
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
                      className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.password
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirmar Contraseña */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Confirmar Contraseña
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.confirmPassword
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Botón de Registro */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? "Registrando..." : "Registrar Cuenta"}
                    </Button>
                  </div>
                </form>

                {/* Separador */}
                <div className="flex items-center my-4">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-3 text-xs text-gray-500">
                    O 
                  </span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Link a Login */}
                <p className="text-center text-xs text-gray-600">
                  ¿Ya tienes una cuenta?{" "}
                  <button
                    onClick={() => alert("Redirigir a Login")}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Inicia Sesión
                  </button>
                </p>
              </div>
            </div>

            {/* Lado derecho - Imagen sin fondo azul */}
            <div
              className="flex-1 flex items-center justify-center p-6"
              style={{ backgroundColor: "rgba(1,105,193,1)" }}
            >
              <div className="max-w-md w-full flex items-center justify-center">
                <img
                  src="/Register.png"
                  alt="Registro JobMatch"
                  className="w-full h-auto max-w-sm object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
