// components/PendingJobCard.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';

type Props = {
  title?: string;
  startAt?: string | Date;
  endAt?: string | Date;
  compensationCLP?: number;
  publisherName?: string;
  /** Punto de referencia para calcular progreso hasta el comienzo. */
  publishedAt?: string | Date;
  className?: string;
};

const fmtCLP = (v?: number) =>
  typeof v === 'number'
    ? new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v)
    : '—';

const fmtTime = (d?: string | Date) =>
  d ? new Intl.DateTimeFormat('es-CL', { hour: '2-digit', minute: '2-digit' }).format(new Date(d)) : '—';

export default function PendingJobCard({
  title = '',
  startAt,
  endAt,
  compensationCLP,
  publisherName = '',
  publishedAt,
  className = '',
}: Props) {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000); // cada 30 s
    return () => clearInterval(id);
  }, []);

  const start = startAt ? new Date(startAt) : undefined;
  const published = publishedAt ? new Date(publishedAt) : undefined;

  const progressPct = useMemo(() => {
    if (!start || !published) return 0;
    const total = start.getTime() - published.getTime();
    if (total <= 0) return 100;
    const elapsed = now.getTime() - published.getTime();
    const pct = (elapsed / total) * 100;
    return Math.max(0, Math.min(100, pct));
  }, [start?.getTime(), published?.getTime(), now]);

  return (
    <article
      className={`rounded-2xl border border-slate-200 shadow-md overflow-hidden bg-white ${className}`}
    >
      {/* Header con gradiente similar a la imagen */}
      <div className="bg-gradient-to-r from-sky-400 to-blue-600 p-5 relative">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            {/* Ícono/placeholder */}
            <span className="text-white text-xl">🧰</span>
          </div>
          <h3 className="text-white text-xl font-semibold truncate">
            {title || 'Título pendiente'}
          </h3>
        </div>
        <span className="absolute top-3 right-3 text-xs font-medium bg-white/80 text-slate-700 px-2 py-1 rounded-full">
          Pendiente
        </span>
      </div>

      {/* Cuerpo */}
      <div className="p-5 space-y-3">
        <p className="text-slate-700">
          <span className="font-medium">Inicio:</span> {fmtTime(startAt)}
        </p>
        <p className="text-slate-700">
          <span className="font-medium">Término:</span> {fmtTime(endAt)}
        </p>
        <p className="text-slate-700">
          <span className="font-medium">Compensación:</span> {fmtCLP(compensationCLP)}
        </p>
        <p className="text-slate-700">
          <span className="font-medium">Publicado por:</span> {publisherName || '—'}
        </p>

        {/* Barra de progreso hacia el comienzo */}
        <div className="pt-2">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Tiempo hasta inicio</span>
            <span>{Math.round(progressPct)}%</span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-blue-600"
              style={{ width: `${progressPct}%` }}
              aria-valuenow={Math.round(progressPct)}
              aria-valuemin={0}
              aria-valuemax={100}
              role="progressbar"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
