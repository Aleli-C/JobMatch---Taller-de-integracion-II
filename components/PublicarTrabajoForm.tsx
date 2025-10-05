"use client";

import React, { useState, useEffect } from "react";
import { useToastContext } from "./ToastContext";

interface Categoria {
  id: number;
  nombre: string;
}

interface Ubicacion {
  id: number;
  ciudad: string;
}

const PublicarTrabajoForm: React.FC<{ userId: number }> = ({ userId }) => {
  const { addToast } = useToastContext();

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    remuneracion: "",
    tipo: "",
    idCategoria: "",
    idUbicacion: "",
    fechaCierre: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);

  // Cargar meta (categorías y ubicaciones)
  useEffect(() => {
    async function fetchMeta() {
      try {
        const res = await fetch("/publications/meta");
        const data = await res.json();
        setCategorias(data.categorias);
        setUbicaciones(data.ubicaciones);
      } catch (err) {
        console.error("Error cargando meta:", err);
      }
    }
    fetchMeta();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.titulo.trim()) newErrors.titulo = "El título es obligatorio.";
    else if (form.titulo.length < 10)
      newErrors.titulo = "El título debe tener al menos 10 caracteres.";

    if (!form.descripcion.trim() || form.descripcion.length < 20)
      newErrors.descripcion = "La descripción debe tener al menos 20 caracteres.";

    if (!form.remuneracion || isNaN(Number(form.remuneracion)))
      newErrors.remuneracion = "La remuneración debe ser un número válido.";
    if (!form.tipo) newErrors.tipo = "Selecciona un tipo de trabajo.";
    if (!form.idCategoria) newErrors.idCategoria = "Selecciona una categoría.";
    if (!form.idUbicacion) newErrors.idUbicacion = "Selecciona una ubicación.";
    if (form.fechaCierre && isNaN(Date.parse(form.fechaCierre)))
      newErrors.fechaCierre = "Fecha de cierre inválida.";

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valErrors = validate();
    setErrors(valErrors);
    if (Object.keys(valErrors).length > 0) return;

    // Convierte los campos a número
    const nuevaPub = {
      ...form,
      idUbicacion: Number(form.idUbicacion),
      idCategoria: Number(form.idCategoria),
      remuneracion: Number(form.remuneracion),
      fechaCierre: form.fechaCierre
        ? new Date(form.fechaCierre).toISOString()
        : null,
    };

    try {
      const res = await fetch("/publications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaPub),
        credentials: "include", // <-- Esto permite enviar la cookie de sesión
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al crear publicación");
      }

      const createdPub = await res.json();

      addToast({
        type: "POST_CREATED",
        title: "Trabajo Publicado",
        message: "¡Tu oferta de trabajo ha sido publicada exitosamente!",
        timestamp: new Date(),
      });

      if (createdPub) {
        // Guardar en localStorage
        const publicaciones = JSON.parse(localStorage.getItem("publicaciones") || "[]");
        publicaciones.push(createdPub);
        localStorage.setItem("publicaciones", JSON.stringify(publicaciones));
        // Limpiar formulario
        setForm({
          titulo: "",
          descripcion: "",
          remuneracion: "",
          tipo: "",
          idCategoria: "",
          idUbicacion: "",
          fechaCierre: "",
        });
      }
    } catch (err: any) {
      console.error(err);
      addToast({
        type: "ERROR",
        title: "Error",
        message: err.message || "Error al crear publicación",
        timestamp: new Date(),
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-[#0069C0] mb-8">
        Publica un Nuevo Trabajo
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-200"
      >
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
            placeholder="Ej. 15000"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0069C0] outline-none"
          />
          {errors.remuneracion && <p className="text-red-500 text-sm mt-1">{errors.remuneracion}</p>}
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Categoría</label>
          <select
            name="idCategoria"
            value={form.idCategoria}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0069C0] outline-none"
          >
            <option value="">Selecciona categoría</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
          {errors.idCategoria && <p className="text-red-500 text-sm mt-1">{errors.idCategoria}</p>}
        </div>

        {/* Ubicación */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Ubicación</label>
          <select
            name="idUbicacion"
            value={form.idUbicacion}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0069C0] outline-none"
          >
            <option value="">Selecciona ubicación</option>
            {ubicaciones.map(ubi => (
              <option key={ubi.id} value={ubi.id}>{ubi.ciudad}</option>
            ))}
          </select>
          {errors.idUbicacion && <p className="text-red-500 text-sm mt-1">{errors.idUbicacion}</p>}
        </div>

        {/* Fecha de cierre */}
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
          <button
            type="submit"
            className="bg-[#0069C0] text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Publicar
          </button>
        </div>
      </form>
    </div>
  );
};

export default PublicarTrabajoForm;