import React, { useState } from "react";
import { useToastContext } from "./ToastContext"

const PublicarTrabajoForm: React.FC = () => {
  const { addToast } = useToastContext();

  // Estado para cada campo
  const [form, setForm] = useState({
    titulo: "",
    ubicacion: "",
    categoria: "",
    monto: "",
    descripcion: "",
  });

  // Estado para mensajes de error
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Validaciones simples
  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Título: mínimo 10 caracteres
    if (!form.titulo.trim()) {
      newErrors.titulo = "El título es obligatorio.";
    } else if (form.titulo.trim().length < 10) {
      newErrors.titulo = "El título debe tener al menos 10 caracteres.";
    }

    // Ubicación: formato "Ciudad, País"
    const ubicacionRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+,\s*[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (!form.ubicacion.trim()) {
      newErrors.ubicacion = "La ubicación es obligatoria.";
    } else if (!ubicacionRegex.test(form.ubicacion.trim())) {
      newErrors.ubicacion = "La ubicación debe tener el formato 'Ciudad, País'.";
    }

    // Categoría
    if (!form.categoria || form.categoria === "Selecciona una categoría") {
      newErrors.categoria = "Selecciona una categoría.";
    }

    // Monto: debe contener "CLP" y un número válido
    const montoRegex = /^(\d{1,3}(?:\.\d{3})*|\d+)\s*CLP(.*)$/i;
    if (!form.monto.trim()) {
      newErrors.monto = "Ingresa un monto.";
    } else if (!montoRegex.test(form.monto.trim())) {
      newErrors.monto = "El monto debe ser un número seguido de 'CLP' (ej: 15.000 CLP por día).";
    }

    // Descripción: mínimo 20 caracteres
    if (!form.descripcion.trim() || form.descripcion.length < 20) {
      newErrors.descripcion = "La descripción debe tener al menos 20 caracteres.";
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valErrors = validate();
    setErrors(valErrors);
    if (Object.keys(valErrors).length > 0) return;

    addToast({
      type: "POST_CREATED",
      title: "Trabajo Publicado",
      message: "¡Tu oferta de trabajo ha sido publicada exitosamente!",
      timestamp: new Date(),
    });

    // Opcional: limpiar formulario
    setForm({ titulo: "", ubicacion: "", categoria: "", monto: "", descripcion: "" });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-[#0069C0] mb-8">
        Publica un Nuevo Trabajo
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-200"
      >
        {/* Título */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Título del Trabajo</label>
          <input
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            type="text"
            placeholder="Ej. Jardinería Básica"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0069C0] outline-none"
          />
          {errors.titulo && <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>}
        </div>

        {/* Ubicación */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Ubicación</label>
          <input
            name="ubicacion"
            value={form.ubicacion}
            onChange={handleChange}
            type="text"
            placeholder="Ej. Temuco, Chile"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0069C0] outline-none"
          />
          {errors.ubicacion && <p className="text-red-500 text-sm mt-1">{errors.ubicacion}</p>}
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Categoría</label>
          <select
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0069C0] outline-none"
          >
            <option>Selecciona una categoría</option>
            <option>Cuidado del Hogar</option>
            <option>Delivery</option>
            <option>Servicio a Domicilio</option>
            <option>Otro</option>
          </select>
          {errors.categoria && <p className="text-red-500 text-sm mt-1">{errors.categoria}</p>}
        </div>

        {/* Monto */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Monto a Pagar</label>
          <input
            name="monto"
            value={form.monto}
            onChange={handleChange}
            type="text"
            placeholder="Ej. 15.000 CLP por día"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0069C0] outline-none"
          />
          {errors.monto && <p className="text-red-500 text-sm mt-1">{errors.monto}</p>}
        </div>

        {/* Descripción */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-semibold mb-2">Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows={5}
            placeholder="Describe detalladamente el puesto, requisitos, beneficios…"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0069C0] outline-none"
          />
          {errors.descripcion && <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>}
        </div>

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
