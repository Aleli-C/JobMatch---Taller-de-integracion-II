"use client";

import React from "react";
import { useActionState } from "react";
import { loginUser, type LoginActionState } from "./actions";
import Button from "../../../components/button";
import { useRouter } from "next/navigation";

const initialState: LoginActionState = {
  ok: false,
};

export default function Login() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    loginUser,
    initialState
  );

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
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/auth/register")}
          >
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

            {/* Error general */}
            {state.errors?.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">
                  {state.errors.general[0]}
                </p>
              </div>
            )}

            <form action={formAction} className="space-y-4">
              {/* Correo Electrónico */}
              <div>
                <label
                  htmlFor="correo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  placeholder="tu@ejemplo.com"
                  className={`w-full px-3 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-gray-100 ${
                    state.errors?.correo
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                />
                {state.errors?.correo && (
                  <p className="text-red-500 text-xs mt-1">
                    {state.errors.correo[0]}
                  </p>
                )}
              </div>

              {/* Contraseña */}
              <div>
                <label
                  htmlFor="contrasena"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  id="contrasena"
                  name="contrasena"
                  placeholder="••••••••"
                  className={`w-full px-3 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-gray-100 ${
                    state.errors?.contrasena
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                />
                {state.errors?.contrasena && (
                  <p className="text-red-500 text-xs mt-1">
                    {state.errors.contrasena[0]}
                  </p>
                )}
              </div>

              {/* Botón de Login */}
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Iniciando Sesión..." : "Iniciar Sesión"}
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
                onClick={() => router.push("/auth/reset")}
                className="text-sm text-gray-600 hover:text-blue-600"
                type="button"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Link a Registro */}
            <p className="text-center text-sm text-gray-600">
              ¿No tienes cuenta aún?{" "}
              <button
                onClick={() => router.push("/auth/register")}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ¡Regístrate!
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
