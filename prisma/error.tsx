"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const reason = searchParams.get("reason");

  const messages: Record<string, string> = {
    duplicate: "Ya existe un registro con ese valor.",
    "foreign-key": "Error de relación en la base de datos.",
    "not-found": "No se encontró el recurso solicitado.",
    validation: "Los datos ingresados no son válidos.",
    "unknown-prisma": "Error desconocido de base de datos.",
    general: "Ocurrió un error inesperado. Inténtalo más tarde.",
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-3xl font-bold text-red-600">⚠ Error</h1>
      <p className="mt-4 text-lg text-gray-700">
        {messages[reason ?? ""] ?? "Ha ocurrido un error."}
      </p>
      <button
        onClick={() => router.push("/")}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Volver al inicio
      </button>
    </div>
  );
}
