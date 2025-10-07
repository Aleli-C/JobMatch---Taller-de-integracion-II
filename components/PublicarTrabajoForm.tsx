// components/PublicarTrabajoForm.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useToastContext } from "./ToastContext";
import { getMeta, createPublicationAction } from "@/app/publications/publications_new/actions";

type Categoria = { id: number; nombre: string };
type Ubicacion = { id: number; ciudad: string | null; comuna: string | null; region: string | null };

export default function PublicarTrabajoForm() {
  const { addToast } = useToastContext();

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    remuneracion: "",
    tipo: "",
    categoriaId: "",
    ubicacionId: "",
    fechaCierre: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);

  useEffect(() => {
    (async () => {
      const meta = await getMeta();
      setCategorias(meta.categorias);
      setUbicaciones(meta.ubicaciones);
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const validate = () => {
    const err: Record<string, string> = {};
    if (!form.titulo.trim() || form.titulo.trim().length < 10) err.titulo = "Mínimo 10 caracteres.";
    if (!form.descripcion.trim() || form.descripcion.trim().length < 20) err.descripcion = "Mínimo 20 caracteres.";
    if (!form.remuneracion || isNaN(Number(form.remuneracion))) err.remuneracion = "Número válido requerido.";
    if (!form.tipo) err.tipo = "Selecciona un tipo.";
    if (!form.categoriaId) err.categoriaId = "Selecciona una categoría.";
    if (!form.ubicacionId) err.ubicacionId = "Selecciona una ubicación.";
    if (form.fechaCierre && isNaN(Date.parse(form.fechaCierre))) err.fechaCierre = "Fecha inválida.";
    return err;
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valErr = validate();
    setErrors(valErr);
    if (Object.keys(valErr).length) return;

    const fd = new FormData();
    fd.set("titulo", form.titulo);
    fd.set("descripcion", form.descripcion);
    fd.set("remuneracion", form.remuneracion);
    fd.set("tipo", form.tipo);
    fd.set("categoriaId", form.categoriaId);
    fd.set("ubicacionId", form.ubicacionId);
    if (form.fechaCierre) fd.set("fechaCierre", form.fechaCierre);

    const res = await createPublicationAction(fd);
    if (!res.ok) {
      addToast({
        type: "ERROR",
        title: "Error",
        message: res.error || "Error al crear la publicación",
        timestamp: new Date(),
      });
      return;
    }

    addToast({
      type: "POST_CREATED",
      title: "Trabajo Publicado",
      message: "¡Tu oferta fue publicada exitosamente!",
      timestamp: new Date(),
    });

    setForm({
      titulo: "",
      descripcion: "",
      remuneracion: "",
      tipo: "",
      categoriaId: "",
      ubicacionId: "",
      fechaCierre: "",
    });
  };

  const labelUbicacion = (u: Ubicacion) =>
    [u.comuna, u.ciudad, u.region].filter(Boolean).join(", ") || "—";

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-[#0069C0] mb-8">
        Publica un Nuevo Trabajo
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        {/* Título */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-semibold mb-2">Título del Trabajo</label>
          <input
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            type="text"
            placeholder="Ej. Jardinería y mantención de áreas verdes"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0069C0] outline-none"
          />
          {errors.titulo && <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>}
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Tipo de Trabajo</label>
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0069C0] outline-none"
          >
            <option value="">Selecciona tipo</option>
            <option value="FULLTIME">Tiempo Completo</option>
            <option value="PARTTIME">Medio Tiempo</option>
            <option value="FREELANCE">Freelance</option>
          </select>
          {errors.tipo && <p className="text-red-500 text-sm mt-1">{errors.tipo}</p>}
        </div>

        {/* Remuneración */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Remuneración (CLP)</label>
          <input
            name="remuneracion"
            value={form.remuneracion}
            onChange={handleChange}
            type="number"
            placeholder="Ej. 150000"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0069C0] outline-none"
          />
          {errors.remuneracion && <p className="text-red-500 text-sm mt-1">{errors.remuneracion}</p>}
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Categoría</label>
          <select
            name="categoriaId"
            value={form.categoriaId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0069C0] outline-none"
          >
            <option value="">Selecciona categoría</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          {errors.categoriaId && <p className="text-red-500 text-sm mt-1">{errors.categoriaId}</p>}
        </div>

        {/* Ubicación */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Ubicación</label>
          <select
            name="ubicacionId"
            value={form.ubicacionId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0069C0] outline-none"
          >
            <option value="">Selecciona ubicación</option>
            {ubicaciones.map((u) => (
              <option key={u.id} value={u.id}>{labelUbicacion(u)}</option>
            ))}
          </select>
          {errors.ubicacionId && <p className="text-red-500 text-sm mt-1">{errors.ubicacionId}</p>}
        </div>

        {/* Fecha de cierre (opcional) */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Fecha de Cierre (opcional)</label>
          <input
            name="fechaCierre"
            value={form.fechaCierre}
            onChange={handleChange}
            type="date"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0069C0] outline-none"
          />
          {errors.fechaCierre && <p className="text-red-500 text-sm mt-1">{errors.fechaCierre}</p>}
        </div>

        {/* Descripción */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-semibold mb-2">Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows={5}
            placeholder="Describe detalladamente el trabajo, requisitos, horarios, beneficios..."
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0069C0] outline-none"
          />
          {errors.descripcion && <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>}
        </div>

        {/* Botón */}
        <div className="md:col-span-2 flex justify-center">
          <button type="submit" className="bg-[#0069C0] text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Publicar
          </button>
        </div>
      </form>
    </div>
  );
}
