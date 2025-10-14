"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect, KeyboardEvent } from "react";

export default function PostulationFilterbar() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [idPublicacion, setIdPublicacion] = useState(sp.get("id_publicacion") ?? "");
  const [idPostulante, setIdPostulante] = useState(sp.get("id_postulante") ?? "");
  const [estado, setEstado] = useState(sp.get("estado_postulacion") ?? "");
  const [fecha, setFecha] = useState(sp.get("fecha") ?? "");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setIdPublicacion(sp.get("id_publicacion") ?? "");
    setIdPostulante(sp.get("id_postulante") ?? "");
    setEstado(sp.get("estado_postulacion") ?? "");
    setFecha(sp.get("fecha") ?? "");
  }, [sp]);

  const apply = () => {
    const params = new URLSearchParams();
    if (idPublicacion) params.set("id_publicacion", idPublicacion);
    if (idPostulante) params.set("id_postulante", idPostulante);
    if (estado) params.set("estado_postulacion", estado);
    if (fecha) params.set("fecha", fecha);
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  };

  const clearAll = () => {
    setIdPublicacion("");
    setIdPostulante("");
    setEstado("");
    setFecha("");
    startTransition(() => router.push(pathname));
  };

  const onEnter = (e: KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.key === "Enter") apply();
  };

  return (
    <section className="rounded-2xl bg-white/80 p-3 sm:p-4 ring-1 ring-gray-200 shadow-sm backdrop-blur">
      <div
        className="
          grid grid-flow-row-dense gap-3
          [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]
        "
      >
        {/* ID Publicación */}
        <input
          value={idPublicacion}
          onChange={(e) => setIdPublicacion(e.target.value)}
          onKeyDown={onEnter}
          placeholder="ID Publicación"
          aria-label="ID Publicación"
          className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          type="number"
          min="1"
        />

        {/* ID Postulante */}
        <input
          value={idPostulante}
          onChange={(e) => setIdPostulante(e.target.value)}
          onKeyDown={onEnter}
          placeholder="ID Postulante"
          aria-label="ID Postulante"
          className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          type="number"
          min="1"
        />

        {/* Estado de la postulación */}
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          onKeyDown={onEnter}
          aria-label="Estado de la postulación"
          className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Estado</option>
          <option value="pendiente">Pendiente</option>
          <option value="aceptada">Aceptada</option>
          <option value="rechazada">Rechazada</option>
        </select>

        {/* Fecha */}
        <input
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          onKeyDown={onEnter}
          placeholder="Fecha"
          aria-label="Fecha"
          className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          type="date"
        />

        <div className="col-span-full flex items-center justify-start gap-2">
          <button
            onClick={clearAll}
            disabled={isPending}
            className="h-11 rounded-xl border border-gray-300 bg-white px-4 text-sm hover:bg-gray-50 disabled:opacity-60"
            type="button"
          >
            Limpiar
          </button>
          <button
            onClick={apply}
            disabled={isPending}
            className="h-11 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            type="button"
          >
            Aplicar
          </button>
        </div>
      </div>
    </section>
  );
}