import React from "react";
import { useToastContext } from "./ToastContext";

const PublicarTrabajoForm: React.FC = () => {
  const { addToast } = useToastContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addToast({
      type: "POST_CREATED",
      title: "Trabajo Publicado",
      message: "¡Tu oferta de trabajo ha sido publicada exitosamente!",
      timestamp: new Date(),
    });
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
        {/* Título del trabajo */}
        <div className="col-span-1">
          <label className="block text-gray-700 font-semibold mb-2">
            Título del Trabajo
          </label>
          <input
            type="text"
            placeholder="Ej. Jardineria Basica"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0069C0] outline-none"
          />
        </div>

        {/* Ubicación */}
        <div className="col-span-1">
          <label className="block text-gray-700 font-semibold mb-2">
            Ubicación
          </label>
          <input
            type="text"
            placeholder="Ej. Temuco, Chile"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0069C0] outline-none"
          />
        </div>

        {/* Categoría */}
        <div className="col-span-1">
          <label className="block text-gray-700 font-semibold mb-2">
            Categoría
          </label>
          <select className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0069C0] outline-none">
            <option>Selecciona una categoría</option>
            <option>Cuidado del Hogar</option>
            <option>Delivery</option>
            <option>Servicio a Domicilio</option>
            <option>Otro</option>
          </select>
        </div>

        {/* Monto */}
        <div className="col-span-1">
          <label className="block text-gray-700 font-semibold mb-2">
            Monto a Pagar
          </label>
          <input
            type="text"
            placeholder="Ej. 15.000 CLP/ por dia"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0069C0] outline-none"
          />
        </div>

        {/* Descripción */}
        <div className="col-span-2">
          <label className="block text-gray-700 font-semibold mb-2">
            Descripción
          </label>
          <textarea
            rows={5}
            placeholder="Describa detalladamente el puesto de trabajo, responsabilidades, requisitos y beneficios..."
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0069C0] outline-none"
          />
        </div>

        {/* Botón */}
        <div className="col-span-2 flex justify-center">
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
