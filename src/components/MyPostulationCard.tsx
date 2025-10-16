"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

interface Postulacion {
  id_postulacion: number;
  id_publicacion: number;
  publicacion_titulo: string;
  mensaje?: string;
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
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetId, setTargetId] = useState<number | null>(null);
  const [targetTitle, setTargetTitle] = useState<string | null>(null);

  const [limit] = useState<number>(9);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setErr(null);

    // leemos los params PROPETARIOS de postulaciones (prefijo p_)
    const params: Record<string, any> = { limit, offset };
    const p_q = searchParams?.get("p_q") ?? "";
    const p_estado = searchParams?.get("p_estado");
    const p_fecha = searchParams?.get("p_fecha");

    // enviar a backend los filtros que sí soporta
    if (p_estado) params.estado_postulacion = p_estado; // backend where p.estado_postulacion = ?
    if (p_fecha) params.fecha = p_fecha;

    api
      .get<{ items: Postulacion[] }>("/mis_postulaciones", {
        params,
        signal: controller.signal,
        withCredentials: true,
      })
      .then(({ data }) => {
        let arr = Array.isArray(data?.items) ? data.items : [];

        // FILTRADO ADICIONAL EN CLIENTE (fallback)
        // 1) estado (case-insensitive, exact match)
        if (p_estado) {
          const est = String(p_estado).toLowerCase();
          arr = arr.filter(
            (it) => String(it.estado_postulacion ?? "").toLowerCase() === est
          );
        }

        // 2) fecha: comparar YYYY-MM-DD exacto (evita problemas de timezone)
        if (p_fecha) {
          const wanted = String(p_fecha);
          arr = arr.filter((it) => {
            try {
              const d = new Date(it.fecha);
              if (Number.isNaN(d.getTime())) return false;
              const isoDate = d.toISOString().slice(0, 10); // YYYY-MM-DD
              return isoDate === wanted;
            } catch {
              return false;
            }
          });
        }

        // 3) búsqueda por título (q) case-insensitive
        if (p_q) {
          const qlow = String(p_q).toLowerCase();
          arr = arr.filter((it) =>
            String(it.publicacion_titulo ?? "").toLowerCase().includes(qlow)
          );
        }

        setPostulaciones(arr);
        setHasMore(Array.isArray(arr) ? arr.length === limit : false);
      })
      .catch((e: any) => {
        if (e.name === "CanceledError") return;
        setErr(String(e?.response?.data?.error ?? e?.message ?? "Error"));
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [searchParams?.toString(), offset, limit]);

  // confirm / delete (mantener tu modal actual)
  const confirmDelete = (id: number, title?: string) => {
    setTargetId(id);
    setTargetTitle(title ?? null);
    setConfirmOpen(true);
  };

  const performDelete = async () => {
    if (!targetId) return;
    try {
      setDeletingId(targetId);
      await api.delete(`/postulaciones/${targetId}`, { withCredentials: true });
      setPostulaciones((prev) => prev.filter((p) => p.id_postulacion !== targetId));
      setConfirmOpen(false);
      setTargetId(null);
      setTargetTitle(null);
    } catch (e: any) {
      setErr(String(e?.response?.data?.error ?? e?.message ?? "Error al eliminar"));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );

  if (err) return <p className="text-red-600">Error: {err}</p>;

  if (!postulaciones.length)
    return <p className="text-gray-500">No hay postulaciones con esos filtros.</p>;

  return (
    <>
      {/* mantiene tu UI completo (cards, paginado, modal) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {postulaciones.map((p) => (
          <article
            key={p.id_postulacion}
            className="group relative rounded-2xl p-[1px] bg-gradient-to-tr from-blue-600/30 via-cyan-400/30 to-purple-500/30"
          >
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 h-full">
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

              {(p.publicacion_ciudad || p.publicacion_region) && (
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <span className="text-gray-600">
                    📍 {p.publicacion_ciudad}
                    {p.publicacion_region ? `, ${p.publicacion_region}` : ""}
                  </span>
                </div>
              )}

              {p.mensaje && (
                <div className="mt-3 rounded-xl bg-gray-50 p-3 ring-1 ring-gray-200">
                  <dt className="text-xs text-gray-500 mb-1">Mensaje</dt>
                  <dd className="text-sm text-gray-700 line-clamp-3">{p.mensaje}</dd>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-xs text-gray-500">
                  {new Date(p.fecha).toLocaleDateString("es-CL")}
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/publicaciones/${p.id_publicacion}`}
                    className="text-sm text-blue-600 hover:underline"
                    aria-label={`Ver publicación ${p.id_publicacion}`}
                  >
                    Ver detalles
                  </Link>

                  <button
                    className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700 disabled:opacity-60"
                    type="button"
                    onClick={() => confirmDelete(p.id_postulacion, p.publicacion_titulo)}
                    disabled={deletingId === p.id_postulacion}
                    aria-label={`Eliminar postulación ${p.id_postulacion}`}
                  >
                    {deletingId === p.id_postulacion ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* pagination */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <button
          onClick={() => setOffset((o) => Math.max(0, o - limit))}
          disabled={offset === 0}
          className="px-3 py-1 rounded-md border bg-white disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-sm text-gray-600">{offset / limit + 1}</span>
        <button
          onClick={() => setOffset((o) => o + limit)}
          disabled={!hasMore}
          className="px-3 py-1 rounded-md border bg-white disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>

      {/* Confirm Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200">
            <h2 className="text-lg font-semibold mb-2">Confirmar eliminación</h2>
            <p className="text-sm text-gray-600 mb-4">
              ¿Estás seguro que deseas eliminar tu postulación
              {targetTitle ? ` a "${targetTitle}"` : ""}? Esta acción no se puede deshacer.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-sm hover:bg-gray-50"
                onClick={() => {
                  setConfirmOpen(false);
                  setTargetId(null);
                  setTargetTitle(null);
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-sm hover:bg-rose-700 disabled:opacity-60"
                onClick={performDelete}
                disabled={deletingId === targetId}
              >
                {deletingId === targetId ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}