import { useState } from "react";
import { MapPin, DollarSign, Calendar } from "lucide-react";
import { useToastContext } from "./ToastContext";

interface Publicacion {
  title: string;
  description: string;
  payment: string;
  location: string;
  date: string;
}

interface PostulacionProps {
  publicacion: Publicacion;
}

export default function PostulacionPage({ publicacion }: PostulacionProps) {
  const { addToast } = useToastContext();

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contacto: "",
    mensaje: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addToast({
      type: "APPLICATION_SUBMITTED",
      title: "Postulación Enviada",
      message: `Has postulado exitosamente a: ${publicacion.title}`,
      timestamp: new Date(),
    });

    setFormData({
      nombre: "",
      correo: "",
      contacto: "",
      mensaje: "",
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Información de la publicación */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {publicacion.title}
        </h2>
        <p className="text-gray-600 mb-4">{publicacion.description}</p>
        <div className="flex flex-wrap gap-4 text-gray-700 text-sm">
          <span className="flex items-center gap-1">
            <DollarSign size={16} /> {publicacion.payment}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={16} /> {publicacion.location}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={16} /> Publicado: {publicacion.date}
          </span>
        </div>
      </div>

      {/* Formulario de postulación */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Completa tu postulación
        </h3>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Nombre completo
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Matias Perez"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: mperez@gmail.com"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Número de contacto
          </label>
          <input
            type="tel"
            name="contacto"
            value={formData.contacto}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: +56 9 1234 5678"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Breve mensaje de postulación
          </label>
          <textarea
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Escribe un breve mensaje sobre por qué eres ideal para este trabajo..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Enviar postulación
        </button>
      </form>
    </div>
  );
}
