"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Bookmark, Eye, Trash2, MapPin, Banknote, Calendar, User2, Tag, Briefcase } from "lucide-react";
import ProfileSidebar from '@/components/ProfileSidebar';


type TipoTrabajo = "ESPONTANEO";
type Estado = "DISPONIBLE" | "CERRADO";

type Favorito = {
  id: number;
  titulo: string;
  descripcion: string;
  remuneracion: number;
  tipo: TipoTrabajo;
  estado: Estado;
  fechaPublicacion: string;
  fechaCierre?: string | null;
  usuario: { id: number; nombre: string };
  ubicacion: { id: number; nombre: string };
  categoria: { id: number; nombre: string };
};

const MOCK: Favorito[] = [
  { id: 201, titulo: "Soporte técnico a domicilio", descripcion: "Instalación de SO y suite básica.", remuneracion: 85000, tipo: "ESPONTANEO", estado: "DISPONIBLE", fechaPublicacion: "2025-09-25T10:00:00Z", fechaCierre: "2025-10-05T23:59:59Z", usuario: { id: 1, nombre: "María Pérez" }, ubicacion: { id: 10, nombre: "Santiago, CL" }, categoria: { id: 7, nombre: "Soporte TI" } },
  { id: 202, titulo: "Pintado express de oficina", descripcion: "Trabajo por día, materiales del cliente.", remuneracion: 120000, tipo: "ESPONTANEO", estado: "CERRADO", fechaPublicacion: "2025-09-23T14:30:00Z", usuario: { id: 2, nombre: "Juan Soto" }, ubicacion: { id: 11, nombre: "Providencia, CL" }, categoria: { id: 3, nombre: "Mantenimiento" } },
  { id: 203, titulo: "Fotografía evento (medio día)", descripcion: "50 fotos editadas. Experiencia previa.", remuneracion: 180000, tipo: "ESPONTANEO", estado: "DISPONIBLE", fechaPublicacion: "2025-09-20T09:00:00Z", usuario: { id: 3, nombre: "Ana Rivas" }, ubicacion: { id: 12, nombre: "Valparaíso, CL" }, categoria: { id: 5, nombre: "Eventos" } },
];

const fmtCLP = (v: number) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(v);
const fmtFecha = (iso: string) => new Intl.DateTimeFormat("es-CL", { dateStyle: "medium" }).format(new Date(iso));

export default function FavoritosPage() {
  const [items, setItems] = useState<Favorito[]>(MOCK);
  const favoritos = useMemo(() => items.filter(i => i.tipo === "ESPONTANEO"), [items]);
  const quitar = (id: number) => setItems(prev => prev.filter(x => x.id !== id));

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 flex items-center gap-3">
        <ProfileSidebar />
        <div className="rounded-xl bg-gradient-to-r from-sky-300 via-blue-500 to-blue-700 p-[2px]">
          <div className="rounded-[10px] bg-white px-4 py-2">
            <h1 className="flex items-center gap-2 text-2xl font-bold text-blue-700">
              <Bookmark className="h-6 w-6" /> Favoritos · Trabajos espontáneos
            </h1>
          </div>
        </div>
      </header>

      {favoritos.length === 0 ? (
        <section className="rounded-xl border border-sky-100 bg-white p-10 text-center text-slate-600">
          No tienes trabajos guardados.
        </section>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2">
          {favoritos.map(job => {
            const estadoStyles = job.estado === "DISPONIBLE"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-rose-50 text-rose-700 border-rose-200";
            return (
              <li
                key={job.id}
                className="group overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm transition hover:shadow-md"
                >
                {/* HEADER AZUL MÁS ALTO, CON LOGO + TÍTULO ADENTRO */}
                <div className="relative h-36 md:h-40 bg-gradient-to-r from-sky-300 via-blue-500 to-blue-700">
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_top_left,white_0%,transparent_55%)]" />

                    {/* Estado arriba-derecha */}
                    <span
                    className={`absolute right-5 top-4 rounded-full border px-2 py-0.5 text-xs font-medium ${
                        job.estado === "DISPONIBLE"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                    >
                    {job.estado === "DISPONIBLE" ? "Disponible" : "Cerrado"}
                    </span>

                    {/* Logo + Título dentro del header */}
                    <div className="absolute left-5 bottom-5 flex items-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl ring-2 ring-white/90 shadow">
                        <Image src="/Trabajo.png" alt={job.titulo} width={64} height={64} className="object-cover" />
                    </div>
                    <div className="min-w-0">
                        <h2 className="truncate text-xl md:text-2xl font-semibold text-white drop-shadow-sm">
                        {job.titulo}
                        </h2>
                        <p className="truncate text-sm text-white/90">{job.categoria.nombre}</p>
                    </div>
                    </div>
                </div>

                {/* CONTENIDO */}
                <div className="px-5 pb-5 pt-5">
                    <p className="text-sm text-slate-700">{job.descripcion}</p>

                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-700">
                    <span className="inline-flex items-center gap-1">
                        <Banknote className="h-4 w-4 text-blue-600" />
                        {fmtCLP(job.remuneracion)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        {job.ubicacion.nombre}
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        Pub: {fmtFecha(job.fechaPublicacion)}
                        {job.fechaCierre ? ` · Cierre: ${fmtFecha(job.fechaCierre)}` : ""}
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <User2 className="h-4 w-4 text-blue-600" />
                        {job.usuario.nombre}
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <Tag className="h-4 w-4 text-blue-600" />
                        {job.tipo}
                    </span>
                    </div>

                    <div className="mt-5 flex gap-3">
                    <Link
                        href={`/jobs/${job.id}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
                    >
                        <Eye className="h-4 w-4" />
                        Ver
                    </Link>
                    <button
                        onClick={() => quitar(job.id)}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110"
                    >
                        <Trash2 className="h-4 w-4" />
                        Quitar de favoritos
                    </button>
                    <Link
                        href={`/jobs/${job.id}`}
                        target="_blank"
                        className="ml-auto inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-sky-50"
                    >
                        <Briefcase className="h-4 w-4 text-blue-600" />
                        Detalle
                    </Link>
                    </div>
                </div>
            </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
