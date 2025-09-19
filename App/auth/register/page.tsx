"use client";

import React, { useState } from "react";
import { z } from "zod";
import Button from "../../components/button";

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
                    O CONTINUE CON
                  </span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Botones de redes sociales */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={() => handleSocialLogin("google")}
                    className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-3 h-3 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </button>

                  <button
                    onClick={() => handleSocialLogin("facebook")}
                    className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <svg
                      className="w-3 h-3 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </button>
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
