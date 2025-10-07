"use client";

import React, { useState } from "react";
import { z } from "zod";
import Button from "../../../components/button";
import { registerUser as registerAction, type RegisterActionResult } from "./actions";
import { useRouter } from "next/navigation";
import { RegisterInput, registerSchema} from "../../../lib/zod/auth";

// Regiones de Chile
const regionesChile = [
  "Arica y Parinacota",
  "Tarapacá",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaíso",
  "Metropolitana de Santiago",
  "Libertador General Bernardo O'Higgins",
  "Maule",
  "Ñuble",
  "Biobío",
  "La Araucanía",
  "Los Ríos",
  "Los Lagos",
  "Aysén del General Carlos Ibáñez del Campo",
  "Magallanes y de la Antártica Chilena",
];


export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterInput>({
    rut: "",
    fullName: "",
    email: "",
    contrasena: "",
    confirmcontrasena: "",
    region: "",
    comuna: "",   // nuevo
    ciudad: "",
    direccion: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterInput | "general", string | string[]>>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Calcular fuerza de contraseña
  const getPasswordStrength = (contrasena: string) => {
    let strength = 0;

    if (contrasena.length >= 8) strength++;
    if (contrasena.length >= 12) strength++;
    if (/(?=.*[a-z])/.test(contrasena)) strength++;
    if (/(?=.*[A-Z])/.test(contrasena)) strength++;
    if (/(?=.*\d)/.test(contrasena)) strength++;
    if (/(?=.*[@$!%*?&#])/.test(contrasena)) strength++;

    if (strength <= 2)
      return { level: "Débil", color: "bg-red-500", width: "33%" };
    if (strength <= 4)
      return { level: "Media", color: "bg-yellow-500", width: "66%" };
    return { level: "Fuerte", color: "bg-green-500", width: "100%" };
  };

  const formatRut = (value: string): string => {
    const cleaned = value.replace(/[^\dkK]/g, "");
    if (cleaned.length <= 1) return cleaned;

    const rut = cleaned.slice(0, -1);
    const verifier = cleaned.slice(-1);

    let formatted = "";
    if (rut.length > 6) {
      formatted = `${rut.slice(0, -6)}.${rut.slice(-6, -3)}.${rut.slice(
        -3
      )}-${verifier}`;
    } else if (rut.length > 3) {
      formatted = `${rut.slice(0, -3)}.${rut.slice(-3)}-${verifier}`;
    } else {
      formatted = `${rut}-${verifier}`;
    }

    return formatted;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    let processedValue = value;
    if (name === "rut") {
      processedValue = formatRut(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Limpiar error específico cuando el usuario empiece a escribir
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const parsed = registerSchema.safeParse(formData);
      if (!parsed.success) {
        setErrors(parsed.error.flatten().fieldErrors as any);
        setIsLoading(false);
        return;
      }
      const validated = parsed.data;

      const fd = new FormData();
      for (const k of Object.keys(validated) as (keyof RegisterInput)[]) {
        fd.append(k, String(validated[k] ?? ""));
      }
      const formDataToSend = new FormData();
      formDataToSend.append("rut", validated.rut);
      formDataToSend.append("fullName", validated.fullName);
      formDataToSend.append("email", validated.email);
      formDataToSend.append("contrasena", validated.contrasena);
      formDataToSend.append(
        "confirmcontrasena",
        validated.confirmcontrasena
      );
      formDataToSend.append("region", validated.region);
      formDataToSend.append("comuna", validated.comuna); // nuevo
      formDataToSend.append("ciudad", validated.ciudad);
      formDataToSend.append("direccion", validated.direccion);

      const result = await registerAction(formDataToSend);

      if (result.success) {
        setSuccessMessage("¡Cuenta creada exitosamente! Redirigiendo...");

        // Limpiar el formulario
        setFormData({
          rut: "", fullName: "", email: "", contrasena: "", confirmcontrasena: "",
          region: "", comuna: "", ciudad: "", direccion: "",
        });
        // Redirigir después de 2 segundos
        setTimeout(() => {
          router.push("/auth/login"); // Ajusta la ruta según tu aplicación
        }, 2000);
      } else if (result.error) {
        // Manejar errores del servidor
        setErrors(result.error);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Formatear errores de Zod
        const formattedErrors: Partial<Record<keyof RegisterInput, string>> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0] as keyof RegisterInput] = err.message;
          }
        });
        setErrors(formattedErrors);
      } else {
        // Error genérico
        setErrors({
          general: [
            "Ocurrió un error inesperado. Por favor, intenta nuevamente.",
          ],
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const contrasenaStrength = formData.contrasena
    ? getPasswordStrength(formData.contrasena)
    : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Contenido principal */}
      <div className="flex justify-center items-start px-4 py-8">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex min-h-[700px]">
            {/* Lado izquierdo - Formulario */}
            <div className="flex-1 p-6 flex items-center">
              <div className="w-full max-w-md mx-auto">
                {/* Título del formulario */}
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    Crea Tu Cuenta
                  </h2>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    JobMatch
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Únase a nosotros hoy para descubrir oportunidades laborales
                    espontáneas diseñadas para usted.
                  </p>
                </div>

                {/* Mensaje de éxito */}
                {successMessage && (
                  <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
                    {successMessage}
                  </div>
                )}

                {/* Mensaje de error general */}
                {errors.general && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                    {Array.isArray(errors.general)
                      ? errors.general.join(", ")
                      : errors.general}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* RUT */}
                  <div>
                    <label
                      htmlFor="rut"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      RUT
                    </label>
                    <input
                      type="text"
                      id="rut"
                      name="rut"
                      value={formData.rut}
                      onChange={handleInputChange}
                      placeholder="12.345.678-9"
                      maxLength={12}
                      className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.rut
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.rut && (
                      <p className="text-red-500 text-xs mt-1">
                        {Array.isArray(errors.rut)
                          ? errors.rut.join(", ")
                          : errors.rut}
                      </p>
                    )}
                  </div>

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
                      placeholder="Juan Pérez"
                      className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.fullName
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-xs mt-1">
                        {Array.isArray(errors.fullName)
                          ? errors.fullName.join(", ")
                          : errors.fullName}
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
                      placeholder="juan.perez@ejemplo.com"
                      className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.email
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {Array.isArray(errors.email)
                          ? errors.email.join(", ")
                          : errors.email}
                      </p>
                    )}
                  </div>

                  {/* Región */}
                  <div>
                    <label
                      htmlFor="region"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Región
                    </label>
                    <select
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.region
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Seleccione una región</option>
                      {regionesChile.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                    {errors.region && (
                      <p className="text-red-500 text-xs mt-1">
                        {Array.isArray(errors.region)
                          ? errors.region.join(", ")
                          : errors.region}
                      </p>
                    )}
                  </div>
                  {/*region*/}
                    <div>
                      <label htmlFor="comuna" className="block text-sm font-medium text-gray-700 mb-1">Comuna</label>
                      <input
                        type="text"
                        id="comuna"
                        name="comuna"
                        value={formData.comuna}
                        onChange={handleInputChange}
                        placeholder="Providencia"
                        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          errors.comuna ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.comuna && (
                        <p className="text-red-500 text-xs mt-1">
                          {Array.isArray(errors.comuna) ? errors.comuna.join(", ") : errors.comuna}
                        </p>
                      )}
                    </div>
                    {/* Ciudad */}
                    <div>
                      <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                      <input
                        type="text"
                        id="ciudad"
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleInputChange}
                        placeholder="Santiago"
                        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          errors.ciudad ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.ciudad && (
                        <p className="text-red-500 text-xs mt-1">
                          {Array.isArray(errors.ciudad) ? errors.ciudad.join(", ") : errors.ciudad}
                        </p>
                      )}
                    </div>

                  {/* Dirección */}
                  <div>
                    <label
                      htmlFor="direccion"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Dirección
                    </label>
                    <input
                      type="text"
                      id="direccion"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                      placeholder="Av. Providencia 123"
                      className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.direccion
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.direccion && (
                      <p className="text-red-500 text-xs mt-1">
                        {Array.isArray(errors.direccion)
                          ? errors.direccion.join(", ")
                          : errors.direccion}
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
                      value={formData.contrasena}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.contrasena
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300"
                      }`}
                    />

                    {/* Indicador de fuerza */}
                    {formData.contrasena && contrasenaStrength && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">
                            Fuerza de la contraseña:
                          </span>
                          <span
                            className={`text-xs font-medium ${
                              contrasenaStrength.level === "Débil"
                                ? "text-red-600"
                                : contrasenaStrength.level === "Media"
                                ? "text-yellow-600"
                                : "text-green-600"
                            }`}
                          >
                            {contrasenaStrength.level}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${contrasenaStrength.color}`}
                            style={{ width: contrasenaStrength.width }}
                          />
                        </div>
                      </div>
                    )}

                    {errors.contrasena && (
                      <p className="text-red-500 text-xs mt-1">
                        {Array.isArray(errors.contrasena)
                          ? errors.contrasena.join(", ")
                          : errors.contrasena}
                      </p>
                    )}
                  </div>

                  {/* Confirmar Contraseña */}
                  <div>
                    <label
                      htmlFor="confirmcontrasena"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Confirmar Contraseña
                    </label>
                    <input
                      type="password"
                      id="confirmcontrasena"
                      name="confirmcontrasena"
                      value={formData.confirmcontrasena}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.confirmcontrasena
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.confirmcontrasena && (
                      <p className="text-red-500 text-xs mt-1">
                        {Array.isArray(errors.confirmcontrasena)
                          ? errors.confirmcontrasena.join(", ")
                          : errors.confirmcontrasena}
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
                <div className="flex items-center my-3">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-3 text-xs text-gray-500">O</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Link a Login */}
                <p className="text-center text-xs text-gray-600">
                  ¿Ya tienes una cuenta?{" "}
                  <button
                    onClick={() => router.push("/auth/login")}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Inicia Sesión
                  </button>
                </p>
              </div>
            </div>

            {/* Lado derecho - Imagen */}
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
