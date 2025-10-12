// app/(auth)/login/page.tsx
"use client";
import React, { useState } from "react";
import Button from "@/components/button";
import api from "@/lib/api";

type Errors = {
  correo?: string;
  contrasena?: string;
  general?: string;
};

export default function Login() {
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setPending(true);

    const fd = new FormData(e.currentTarget);
    const payload = {
      correo: String(fd.get("correo") || ""),
      contrasena: String(fd.get("contrasena") || ""),
    };

    try {
      const res = await api.post("/login", payload);
      // Cookie de sesión via Set-Cookie (recomendado) o JWT en body
      if (res.data?.token) {
        // opcional si tu API devuelve JWT:
        localStorage.setItem("token", res.data.token);
      }
      window.location.href = "/"; // redirige donde corresponda
    } catch (err: any) {
      const resp = err?.response;
      if (resp) {
        // Intenta mapear errores habituales { errors: { campo: [msg] } } o { message: '...' }
        const apiErrors = resp.data?.errors || {};
        setErrors({
          correo: apiErrors?.correo?.[0],
          contrasena: apiErrors?.contrasena?.[0],
          general:
            apiErrors?.general?.[0] ||
            resp.data?.message ||
            "Credenciales inválidas",
        });
      } else {
        setErrors({ general: "Error de red. Intenta nuevamente." });
      }
    } finally {
      setPending(false);
    }
  };

  const handleRegister = () => (window.location.href = "/auth/register");
  const handleForgotPassword = () => (window.location.href = "/auth/reset");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Inicio de Sesión
              </h2>
              <p className="text-gray-600 text-sm">
                Bienvenido. Introduce tus datos.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  placeholder="tu@ejemplo.com"
                  className={`w-full px-3 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors bg-gray-100 ${
                    errors.correo ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.correo && (
                  <p className="text-red-500 text-xs mt-1">{errors.correo}</p>
                )}
              </div>

              <div>
                <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="contrasena"
                  name="contrasena"
                  placeholder="••••••••"
                  className={`w-full px-3 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors bg-gray-100 ${
                    errors.contrasena ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.contrasena && (
                  <p className="text-red-500 text-xs mt-1">{errors.contrasena}</p>
                )}
              </div>

              <Button type="submit" disabled={pending} className="w-full">
                {pending ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>

            {errors.general && (
              <p className="text-red-600 text-sm mt-4">{errors.general}</p>
            )}

            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">O</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <div className="text-center mb-4">
              <button onClick={handleForgotPassword} className="text-sm text-gray-600 hover:text-blue-600">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <p className="text-center text-sm text-gray-600">
              ¿No tienes cuenta aún?{" "}
              <button onClick={handleRegister} className="text-blue-600 hover:text-blue-800 font-medium">
                ¡Regístrate!
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
