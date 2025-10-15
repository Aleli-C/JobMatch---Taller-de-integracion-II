"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

type Publicacion = {
  id_publicacion: number;
  id_usuario: number;
  titulo: string;
  descripcion: string;
  direccion?: string | null;
  horario?: string | null;
  tipo?: string | null;
  monto?: number | string | null;
  horas?: string | null;
  estado: "activa" | "pausada" | "cerrada" | "eliminada";
  ciudad?: string | null;
  region?: string | null;
  created_at?: string | null;
  fecha_actualizacion?: string | null;
};

const clp = (v: number | string | null | undefined) => {
  const n = typeof v === "string" ? Number(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n)
    ? new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
      }).format(n)
    : "—";
};

const estadoStyle: Record<Publicacion["estado"], string> = {
  activa: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  pausada: "bg-amber-50 text-amber-700 ring-amber-200",
  cerrada: "bg-gray-100 text-gray-700 ring-gray-300",
  eliminada: "bg-rose-50 text-rose-700 ring-rose-200",
};

const tipoStyle: Record<
  string,
  { bg: string; text: string; ring: string; gradient: string }
> = {
  necesidad: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-200",
    gradient: "from-blue-600/30 via-cyan-400/30 to-purple-500/30",
  },
  servicio: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
    gradient: "from-emerald-500/30 via-teal-400/30 to-sky-500/30",
  },
};

export default function PublicationDetail({ id }: { id: number }) {
  const [pub, setPub] = useState<Publicacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setErr(null);

    api
      .get<Publicacion>(`/publicaciones/${id}`, {
        signal: controller.signal,
      })
      .then(({ data }) => {
        setPub(data);
      })
      .catch((e: any) => {
        if (e.name === "CanceledError") return;
        setErr(
          String(
            e?.response?.data?.error ??
              e?.message ??
              "Error al cargar la publicación"
          )
        );
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
          <div className="h-32 bg-gray-100 rounded-2xl"></div>
          <div className="h-64 bg-gray-100 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="rounded-2xl bg-red-50 p-6 ring-1 ring-red-200">
          <p className="text-red-600 font-medium">Error: {err}</p>
        </div>
      </div>
    );
  }

  if (!pub) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="rounded-2xl bg-gray-50 p-6 ring-1 ring-gray-200">
          <p className="text-gray-600">Publicación no encontrada</p>
        </div>
      </div>
    );
  }

  const tipoKey = (pub.tipo ?? "").toLowerCase();
  const style = tipoStyle[tipoKey] || tipoStyle.necesidad;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Botón volver */}
      <button
        onClick={() => window.history.back()}
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Volver a publicaciones
      </button>

      {/* Card principal */}
      <article
        className={`relative rounded-2xl p-[1px] bg-gradient-to-tr ${style.gradient}`}
      >
        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-gray-200">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-gray-200">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ring ${style.bg} ${style.text} ${style.ring}`}
                >
                  {pub.tipo || "Publicación"}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ring ${
                    estadoStyle[pub.estado]
                  }`}
                >
                  {pub.estado}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {pub.titulo}
              </h1>
            </div>
          </div>

          {/* Descripción */}
          <div className="py-6 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Descripción
            </h2>
            <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
              {pub.descripcion}
            </p>
          </div>

          {/* Detalles principales */}
          <div className="py-6 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Detalles
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pub.monto != null && (
                <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-gray-200">
                  <dt className="text-sm text-gray-500 mb-1">Monto</dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {clp(pub.monto)}
                  </dd>
                </div>
              )}
              {pub.horas && (
                <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-gray-200">
                  <dt className="text-sm text-gray-500 mb-1">Horas</dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {pub.horas}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Ubicación y horario */}
          <div className="py-6 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Ubicación y Horario
            </h2>
            <dl className="space-y-4">
              {(pub.ciudad || pub.region) && (
                <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-gray-200">
                  <dt className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                    <span>📍</span>
                    <span>Ubicación</span>
                  </dt>
                  <dd className="text-base font-medium text-gray-900">
                    {pub.ciudad}
                    {pub.ciudad && pub.region ? ", " : ""}
                    {pub.region}
                  </dd>
                </div>
              )}
              {pub.direccion && (
                <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-gray-200">
                  <dt className="text-sm text-gray-500 mb-1">Dirección</dt>
                  <dd className="text-base font-medium text-gray-900">
                    {pub.direccion}
                  </dd>
                </div>
              )}
              {pub.horario && (
                <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-gray-200">
                  <dt className="text-sm text-gray-500 mb-1">Horario</dt>
                  <dd className="text-base font-medium text-gray-900">
                    {pub.horario}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Información adicional */}
          <div className="pt-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Información Adicional
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-500 mb-1">Publicado</dt>
                <dd className="text-gray-900 font-medium">
                  {pub.created_at
                    ? new Date(pub.created_at).toLocaleDateString("es-CL", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "—"}
                </dd>
              </div>
              {pub.fecha_actualizacion && (
                <div>
                  <dt className="text-gray-500 mb-1">Última actualización</dt>
                  <dd className="text-gray-900 font-medium">
                    {new Date(pub.fecha_actualizacion).toLocaleDateString(
                      "es-CL",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Botón de acción */}
          {pub.estado === "activa" && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-medium text-white transition-colors ${
                  tipoKey === "servicio"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                type="button"
              >
                Contactar
              </button>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
