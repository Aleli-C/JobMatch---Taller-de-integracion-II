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

  // --- nuevo estado de errores ---
  const [errors, setErrors] = useState({
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
    setErrors((prev) => ({ ...prev, [name]: "" })); // limpia error al escribir
  };

  const validate = () => {
    const newErrors = { nombre: "", correo: "", contacto: "", mensaje: "" };
    let isValid = true;

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio.";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correo.trim()) {
      newErrors.correo = "El correo es obligatorio.";
      isValid = false;
    } else if (!emailRegex.test(formData.correo)) {
      newErrors.correo = "Correo no válido.";
      isValid = false;
    }

    // Teléfono: debe ser +569 seguido de 8 dígitos
    const phoneRegex = /^\+569\d{8}$/;
    if (!formData.contacto.trim()) {
      newErrors.contacto = "El número de contacto es obligatorio.";
      isValid = false;
    } else if (!phoneRegex.test(formData.contacto.replace(/\s/g, ""))) {
      newErrors.contacto = "El formato debe ser +569XXXXXXXX (8 dígitos después de +569).";
      isValid = false;
    }

    // Mensaje: mínimo 20 palabras
    const wordCount = formData.mensaje.trim().split(/\s+/).filter(Boolean).length;
    if (!formData.mensaje.trim()) {
      newErrors.mensaje = "El mensaje no puede estar vacío.";
      isValid = false;
    } else if (wordCount < 20) {
      newErrors.mensaje = "El mensaje debe tener al menos 20 palabras.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return; // detiene si hay errores

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

        {/* Nombre */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Nombre completo
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
              errors.nombre ? "border-red-500" : "focus:ring-blue-500"
            }`}
            placeholder="Ej: Matias Perez"
          />
          {errors.nombre && (
            <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
          )}
        </div>

        {/* Correo */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
              errors.correo ? "border-red-500" : "focus:ring-blue-500"
            }`}
            placeholder="Ej: mperez@gmail.com"
          />
          {errors.correo && (
            <p className="text-red-500 text-sm mt-1">{errors.correo}</p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Número de contacto
          </label>
          <input
            type="tel"
            name="contacto"
            value={formData.contacto}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
              errors.contacto ? "border-red-500" : "focus:ring-blue-500"
            }`}
            placeholder="Ej: +56 9 1234 5678"
          />
          {errors.contacto && (
            <p className="text-red-500 text-sm mt-1">{errors.contacto}</p>
          )}
        </div>

        {/* Mensaje */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Breve mensaje de postulación
          </label>
          <textarea
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
              errors.mensaje ? "border-red-500" : "focus:ring-blue-500"
            }`}
            placeholder="Escribe un breve mensaje..."
          />
          {errors.mensaje && (
            <p className="text-red-500 text-sm mt-1">{errors.mensaje}</p>
          )}
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
