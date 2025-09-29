"use client";

import React, { useState } from "react";
import { z } from "zod";
import Button from "../../../components/button";
import { registerUser } from "./actions";
import { useRouter } from "next/navigation";

// Validación personalizada para RUT
const rutRegex = /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]{1}$/;

const validateRut = (rut: string): boolean => {
  if (!rutRegex.test(rut)) return false;

  const cleanRut = rut.replace(/\./g, "").replace("-", "");
  const rutNumber = cleanRut.slice(0, -1);
  const verifier = cleanRut.slice(-1).toUpperCase();

  let sum = 0;
  let multiplier = 2;

  for (let i = rutNumber.length - 1; i >= 0; i--) {
    sum += parseInt(rutNumber[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = sum % 11;
  const expectedVerifier =
    remainder === 0 ? "0" : remainder === 1 ? "K" : (11 - remainder).toString();

  return verifier === expectedVerifier;
};

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

// Schema de validación con Zod
const registerSchema = z
  .object({
    rut: z
      .string()
      .min(1, "El RUT es requerido")
      .refine(validateRut, "RUT inválido. Formato: 11.111.111-0"),
    fullName: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre no puede exceder 50 caracteres"),
    email: z.string().email("Por favor ingresa un email válido"),
    contrasena: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
      ),
    confirmcontrasena: z.string(),
    region: z.string().min(1, "Seleccione una región"),
    ciudad: z
      .string()
      .min(2, "La ciudad debe tener al menos 2 caracteres")
      .max(60, "La ciudad no puede exceder 60 caracteres"),
    direccion: z
      .string()
      .min(5, "La dirección debe tener al menos 5 caracteres")
      .max(255, "La dirección no puede exceder 255 caracteres"),
  })
  .refine((data) => data.contrasena === data.confirmcontrasena, {
    message: "Las contraseñas no coinciden",
    path: ["confirmcontrasena"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterForm>({
    rut: "",
    fullName: "",
    email: "",
    contrasena: "",
    confirmcontrasena: "",
    region: "",
    ciudad: "",
    direccion: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterForm | "general", string | string[]>>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
      // Validar datos con Zod primero (del lado del cliente)
      const validatedData = registerSchema.parse(formData);

      // Crear FormData para enviar al servidor
      const formDataToSend = new FormData();
      formDataToSend.append("rut", validatedData.rut);
      formDataToSend.append("fullName", validatedData.fullName);
      formDataToSend.append("email", validatedData.email);
      formDataToSend.append("contrasena", validatedData.contrasena);
      formDataToSend.append(
        "confirmcontrasena",
        validatedData.confirmcontrasena
      );
      formDataToSend.append("region", validatedData.region);
      formDataToSend.append("ciudad", validatedData.ciudad);
      formDataToSend.append("direccion", validatedData.direccion);

      // Llamar a la Server Action
      const result = await registerUser(formDataToSend);

      if (result.success) {
        setSuccessMessage("¡Cuenta creada exitosamente! Redirigiendo...");

        // Limpiar el formulario
        setFormData({
          rut: "",
          fullName: "",
          email: "",
          contrasena: "",
          confirmcontrasena: "",
          region: "",
          ciudad: "",
          direccion: "",
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
        const formattedErrors: Partial<Record<keyof RegisterForm, string>> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0] as keyof RegisterForm] = err.message;
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
            onClick={() => router.push("/auth/login")}
          >
            Iniciar Sesión
          </Button>
        </div>
      </header>

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

                  {/* Ciudad/Comuna */}
                  <div>
                    <label
                      htmlFor="ciudad"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Ciudad/Comuna
                    </label>
                    <input
                      type="text"
                      id="ciudad"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleInputChange}
                      placeholder="Santiago"
                      className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.ciudad
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.ciudad && (
                      <p className="text-red-500 text-xs mt-1">
                        {Array.isArray(errors.ciudad)
                          ? errors.ciudad.join(", ")
                          : errors.ciudad}
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
