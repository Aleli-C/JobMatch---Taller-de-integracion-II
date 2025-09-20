import React from "react";
import { useToastContext } from "./ToastContext";

const PublicarServicioForm: React.FC = () => {
  const { addToast } = useToastContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addToast({
      type: "POST_CREATED",
      title: "Servicio Publicado",
      message: "¡Tu servicio ha sido publicado exitosamente!",
      timestamp: new Date(),
    });
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
            placeholder="Ej. Jardineria Basica"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0069C0] outline-none"
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Categoría
          </label>
          <select className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0069C0] outline-none">
            <option>Selecciona una categoría</option>
            <option>Servicios Informáticos</option>
            <option>Educación</option>
            <option>Cuidado de Mascotas</option>
            <option>Otro</option>
          </select>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Descripción del Servicio
          </label>
          <textarea
            rows={5}
            placeholder="Describe las responsabilidades, requisitos y beneficios del puesto."
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0069C0] outline-none"
          />
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
