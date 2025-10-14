"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect, KeyboardEvent } from "react";

export default function ForumFilterbar() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [q, setQ] = useState(sp.get("q") ?? "");
  const [isPending, startTransition] = useTransition();

  // Mantiene el campo sincronizado con la URL
  useEffect(() => {
    setQ(sp.get("q") ?? "");
  }, [sp]);

  // Aplica el filtro (actualiza URL)
  const apply = () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  };

  // Limpia los filtros
  const clearAll = () => {
    setQ("");
    startTransition(() => router.push(pathname));
  };

  const onEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") apply();
  };

  return (
    <section className="rounded-2xl bg-white/80 p-3 sm:p-4 ring-1 ring-gray-200 shadow-sm backdrop-blur">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Buscar por título o texto */}
        <div className="relative flex-1 w-full">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onEnter}
            placeholder="Buscar foros por título o contenido"
            aria-label="Buscar foros"
            className="h-11 w-full rounded-xl border border-gray-300 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">🔎</span>
        </div>

        {/* Botones */}
        <div className="flex items-center gap-2">
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
