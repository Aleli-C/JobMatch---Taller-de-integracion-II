// app/error.tsx
"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log opcional (en cliente). Para logs de servidor, usa middleware/observabilidad.
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="max-w-md w-full rounded-2xl border p-6 shadow-sm bg-white">
        <h1 className="text-xl font-semibold">Ocurrió un error</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Intenta recargar la página o vuelve a la página anterior.
        </p>
        <div className="flex gap-2 mt-6">
          <button
            className="px-4 py-2 rounded bg-black text-white"
            onClick={reset} // reintenta renderizar el segmento
          >
            Reintentar
          </button>
          <a
            href="/"
            className="px-4 py-2 rounded border border-black text-black bg-white"
          >
            Ir al inicio
          </a>
        </div>
      </div>
    </div>
  );
}
