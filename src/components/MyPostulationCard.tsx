"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Postulacion {
  id_postulacion: number;
  id_publicacion: number;
  publicacion_titulo: string;
  mensaje: string;
  estado_postulacion: "pendiente" | "aceptada" | "rechazada";
  fecha: string;
  publicacion_ciudad?: string;
  publicacion_region?: string;
}

const estadoStyle: Record<Postulacion["estado_postulacion"], string> = {
  pendiente: "bg-amber-50 text-amber-700 ring-amber-200",
  aceptada: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rechazada: "bg-rose-50 text-rose-700 ring-rose-200",
};

export default function MyPostulationCard() {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setErr(null);

    api
      .get<{ items: Postulacion[] }>("/mis_postulaciones", {
        params: {
          limit: 20,
          offset: 0,
        },
        signal: controller.signal,
        withCredentials: true,
      })
      .then(({ data }) => {
        const arr = Array.isArray(data?.items) ? data.items : [];
        setPostulaciones(arr);
      })
      .catch((e: any) => {
        if (e.name === "CanceledError") return;
        setErr(String(e?.response?.data?.error ?? e?.message ?? "Error"));
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  if (loading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );

  if (err) return <p className="text-red-600">Error: {err}</p>;

  if (postulaciones.length === 0)
    return <p className="text-gray-500">No tienes postulaciones aún.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {postulaciones.map((p) => (
        <article
          key={p.id_postulacion}
          className="group relative rounded-2xl p-[1px] bg-gradient-to-tr from-blue-600/30 via-cyan-400/30 to-purple-500/30"
        >
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 h-full">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold leading-tight line-clamp-2">
                {p.publicacion_titulo}
              </h3>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs ring ${
                  estadoStyle[p.estado_postulacion]
                }`}
              >
                {p.estado_postulacion}
              </span>
            </div>

            {/* Ubicación */}
            {(p.publicacion_ciudad || p.publicacion_region) && (
              <div className="mt-1 flex items-center gap-2 text-xs">
                <span className="text-gray-600">
                  📍 {p.publicacion_ciudad}
                  {p.publicacion_region ? `, ${p.publicacion_region}` : ""}
                </span>
              </div>
            )}

            {/* Mensaje con formato igual a PublicationCard */}
            {p.mensaje && (
              <div className="mt-3 rounded-xl bg-gray-50 p-3 ring-1 ring-gray-200">
                <dt className="text-xs text-gray-500 mb-1">Mensaje</dt>
                <dd className="text-sm text-gray-700 line-clamp-3">{p.mensaje}</dd>
              </div>
            )}

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {new Date(p.fecha).toLocaleDateString("es-CL")}
              </span>
              <button
                className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                type="button"
              >
                Ver detalles
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}