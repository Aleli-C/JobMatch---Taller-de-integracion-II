import React, { useState } from "react";
import { useToastContext } from "./ToastContext";

const PublicarServicioForm: React.FC = () => {
  const { addToast } = useToastContext();

  // --- estados de formulario y errores ---
  const [formData, setFormData] = useState({
    titulo: "",
    categoria: "",
    descripcion: "",
  });
  const [errors, setErrors] = useState({
    titulo: "",
    categoria: "",
    descripcion: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // limpia error al escribir
  };

  const validate = () => {
    const newErrors = { titulo: "", categoria: "", descripcion: "" };
    let valid = true;

    if (!formData.titulo.trim()) {
      newErrors.titulo = "El título es obligatorio.";
      valid = false;
    } else if (formData.titulo.length < 10) {
      newErrors.titulo = "El título debe tener al menos 10 caracteres.";
      valid = false;
    }

    if (!formData.categoria || formData.categoria === "Selecciona una categoría") {
      newErrors.categoria = "Selecciona una categoría válida.";
      valid = false;
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es obligatoria.";
      valid = false;
    } else if (formData.descripcion.length < 20) {
      newErrors.descripcion = "La descripción debe tener al menos 20 caracteres.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    addToast({
      type: "POST_CREATED",
      title: "Servicio Publicado",
      message: "¡Tu servicio ha sido publicado exitosamente!",
      timestamp: new Date(),
    });

    // Limpia el formulario
    setFormData({ titulo: "", categoria: "", descripcion: "" });
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-[#0069C0] mb-2">
        Publica Tu Servicio
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Rellena los detalles para tu nueva publicación.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6"
      >
        {/* Título */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Título del Servicio
          </label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Ej. Jardinería Básica"
            className={`w-full border rounded-lg p-3 focus:ring-2 ${
              errors.titulo ? "border-red-500" : "border-gray-300 focus:ring-[#0069C0]"
            }`}
          />
          {errors.titulo && <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>}
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Categoría</label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className={`w-full border rounded-lg p-3 focus:ring-2 ${
              errors.categoria ? "border-red-500" : "border-gray-300 focus:ring-[#0069C0]"
            }`}
          >
            <option>Selecciona una categoría</option>
            <option>Servicios Informáticos</option>
            <option>Educación</option>
            <option>Cuidado de Mascotas</option>
            <option>Otro</option>
          </select>
          {errors.categoria && (
            <p className="text-red-500 text-sm mt-1">{errors.categoria}</p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Descripción del Servicio
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={5}
            placeholder="Describe las responsabilidades, requisitos y beneficios."
            className={`w-full border rounded-lg p-3 focus:ring-2 ${
              errors.descripcion ? "border-red-500" : "border-gray-300 focus:ring-[#0069C0]"
            }`}
          />
          {errors.descripcion && (
            <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>
          )}
        </div>

        {/* Botón */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-[#0069C0] text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Publicar Oferta
          </button>
        </div>
      </form>
    </div>
  );
};

export default PublicarServicioForm;
