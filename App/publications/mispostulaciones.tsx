import { useState } from "react";
import PostulationCard from "../../components/PostulationCard";

export default function MisPostulaciones() {
  const postulaciones = [
    {
      title: "Paseador de perros",
      description: "Se necesita persona responsable para pasear perros de raza golden retriever, durante fines de semana y algunos días de semana.",
      payment: "$10.000 CLP por paseo",
      location: "Villarica, Chile",
      date: "15/09/2025",
      message: "Tengo experiencia cuidando y paseando perros en mi barrio.",
      status: "accepted" as const,
    },
    {
      title: "Ayudante de matemáticas",
      description: "Clases particulares de matemáticas para estudiante de enseñanza media, con dificultades en álgebra y geometría.",
      payment: "$15.000 CLP por hora",
      location: "Remoto",
      date: "14/09/2025",
      message: "Soy estudiante de ingeniería y disfruto enseñar matemáticas.",
      status: "pending" as const,
    },
    {
      title: "Jardinería básica",
      description: "Se requiere ayuda para cortar pasto y regar plantas los fines de semana.",
      payment: "$25.000 CLP por jornada",
      location: "Temuco, Chile",
      date: "13/09/2025",
      message: "Tengo experiencia en mantención de jardines familiares.",
      status: "rejected" as const,
    },
    {
      title: "Pintura de rejas",
      description: "Trabajo de pintura y mantencion de rejas y portones metalicos",
      payment: "$30.000 CLP por jornada",
      location: "Gorbea, Chile",
      date: "12/09/2025",
      message: "Cuento con herramientas y experiencia en pintura de estructuras.",
      status: "pending" as const,
    },
    {
      title: "Reparto en bicicleta",
      description: "Se busca persona para reparto de comida en bicicleta por las tardes de los fines de semana.",
      payment: "$20.000 CLP + propinas",
      location: "Loncoche, Chile",
      date: "11/09/2025",
      message: "Tengo bicicleta propia y disponibilidad en horarios flexibles.",
      status: "accepted" as const,
    },
    {
      title: "Ayudante de mudanza",
      description: "Se necesita apoyo para cargar y descargar muebles en mudanza entre distintas ciudades.",
      payment: "$35.000 CLP por día",
      location: "Temuco, Chile",
      date: "10/09/2025",
      message: "Soy fuerte, responsable y ya he ayudado en varias mudanzas.",
      status: "pending" as const,
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(postulaciones.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPostulaciones = postulaciones.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="p-6 flex flex-col gap-6 max-w-4xl mx-auto">
      {currentPostulaciones.map((postulacion, index) => (
        <PostulationCard key={index} {...postulacion} />
      ))}

      {/* Paginación */}
      <div className="flex justify-center mt-8 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded-md border ${
              currentPage === page
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
