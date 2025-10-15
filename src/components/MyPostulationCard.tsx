import React, { useEffect, useState } from "react";
import api from "@/lib/api";

interface Postulacion {
  id_postulacion: number;
  id_publicacion: number;
  publicacion_titulo: string;
  mensaje: string;
  estado_postulacion: "pendiente" | "aceptada" | "rechazada";
  fecha: string;
  publicacion_ciudad?: string;
  publicacion_region?: string;
}

export default function MyPostulationCard() {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostulaciones = async () => {
      try {
        const uid = localStorage.getItem("uid");
        const res = await api.get(`/mis_postulaciones?userId=${uid}`);
        setPostulaciones(res.data.items || []);
      } catch (err) {
        console.error("Error al obtener postulaciones:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPostulaciones();
  }, []);

  if (loading) return <p>Cargando postulaciones...</p>;

  if (postulaciones.length === 0)
    return <p className="text-gray-500 text-center">No tienes postulaciones aún.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {postulaciones.map((p) => (
        <div
          key={p.id_postulacion}
          className="border rounded-2xl p-4 shadow hover:shadow-lg transition"
        >
          <h2 className="text-lg font-semibold text-blue-700">
            {p.publicacion_titulo}
          </h2>
          <p className="text-sm text-gray-600 mt-2">{p.mensaje}</p>

          <div className="mt-3 flex justify-between items-center">
            <span
              className={`px-2 py-1 rounded text-white text-sm ${
                p.estado_postulacion === "pendiente"
                  ? "bg-yellow-500"
                  : p.estado_postulacion === "aceptada"
                  ? "bg-green-600"
                  : "bg-red-600"
              }`}
            >
              {p.estado_postulacion}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(p.fecha).toLocaleDateString()}
            </span>
          </div>

          <div className="text-xs text-gray-500 mt-2">
            {p.publicacion_ciudad}, {p.publicacion_region}
          </div>
        </div>
      ))}
    </div>
  );
}