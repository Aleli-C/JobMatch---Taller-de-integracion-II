"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import DetailForumCard from "./DetailForumCard";
import type { ForumDetail } from "@/types/forum";
import { fetchForums } from "@/services/forums";

export default function Forum() {
  const sp = useSearchParams();
  const [foros, setForos] = useState<ForumDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [selected, setSelected] = useState<ForumDetail | null>(null); // foro seleccionado

  useEffect(() => {
    const q = sp.get("q") ?? undefined;
    setLoading(true);
    setErr(null);
    fetchForums({ q })
      .then(setForos)
      .catch(() => setErr("Error al cargar foros"))
      .finally(() => setLoading(false));
  }, [sp]);

  if (loading) return <div className="p-6 text-gray-500">Cargando foros…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;
  if (!foros.length) return <div className="p-6 text-gray-500">No hay foros que coincidan.</div>;

  return (
    <div className="relative">
      <div className="space-y-4 p-4">
        {foros.map((f) => (
          <article
            key={f.id_foro}
            onClick={() => setSelected(f)}
            className="cursor-pointer transition-transform hover:scale-[1.01]"
          >
            <DetailForumCard post={f} />
          </article>
        ))}
      </div>

      {/* SUPERPOSICIÓN (overlay) */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelected(null)} // cierra al hacer clic fuera
        >
          <div
            className="max-w-2xl w-full mx-4 rounded-2xl bg-white shadow-xl p-6 relative"
            onClick={(e) => e.stopPropagation()} // evita cerrar al hacer clic dentro
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              aria-label="Cerrar"
            >
              ✕
            </button>

            <DetailForumCard post={selected} />
          </div>
        </div>
      )}
    </div>
  );
}
