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
    <div className="space-y-4 p-4">
      {foros.map((f) => (
        <DetailForumCard key={f.id_foro} post={f} />
      ))}
    </div>
  );
}
