// src/app/publications/publications_mock/page.tsx
import * as React from "react";
import PendingPublicationCard from "@/components/PendingPublicationCard";
import type { Publication } from "@/types/publication";

// 🔹 Mock estático basado en tu tabla "Publicaciones"
const mockPublications: Publication[] = [
  {
    id_publicacion: 1,
    id_usuario: 10,
    titulo: "Clases de Matemáticas Avanzadas",
    descripcion:
      "Refuerzo en cálculo, álgebra lineal y ecuaciones diferenciales. Ideal para universitarios.",
    direccion: "Av. Providencia 1122, Santiago",
    horario: "Lun–Vie 18:00–21:00",
    tipo: "servicio",
    monto: 20000,
    horas: "6h/semana",
    estado: "pausada", // 👈 Pendiente
    ciudad: "Santiago",
    region: "Región Metropolitana",
    created_at: "2025-10-10T14:32:15.123Z",
    fecha_actualizacion: "2025-10-15T10:05:40.987Z",
  },
  {
    id_publicacion: 2,
    id_usuario: 8,
    titulo: "Diseño Gráfico para Emprendedores",
    descripcion:
      "Logo, branding y diseño de tarjetas. Entrega rápida y comunicación constante.",
    direccion: "Remoto",
    horario: "A convenir",
    tipo: "servicio",
    monto: 120000,
    horas: "Proyecto puntual",
    estado: "cerrada", // 👈 Pendiente
    ciudad: "Valparaíso",
    region: "V Región",
    created_at: "2025-09-20T09:00:00.000Z",
    fecha_actualizacion: "2025-10-01T12:00:00.000Z",
  },
  {
    id_publicacion: 3,
    id_usuario: 15,
    titulo: "Arriendo pieza amoblada con baño privado",
    descripcion:
      "Habitación independiente, con baño, wifi y luz natural. Ideal para estudiantes.",
    direccion: "Los Olmos 45, Valparaíso",
    horario: "Entrada libre",
    tipo: "arriendo",
    monto: 280000,
    horas: null,
    estado: "eliminada", // 👈 Pendiente
    ciudad: "Valparaíso",
    region: "V Región",
    created_at: "2025-09-12T08:30:00.000Z",
    fecha_actualizacion: "2025-09-25T10:15:00.000Z",
  },
  {
    id_publicacion: 4,
    id_usuario: 20,
    titulo: "Desarrollo Web para PYMES",
    descripcion:
      "Sitio web corporativo con Next.js y hosting incluido por 1 año.",
    direccion: "Remoto",
    horario: "Lun–Sáb 10:00–18:00",
    tipo: "servicio",
    monto: 950000,
    horas: "Tiempo completo (3 semanas)",
    estado: "activa", // 👈 No se renderiza (descartada por el componente)
    ciudad: "Concepción",
    region: "Biobío",
    created_at: "2025-10-09T16:30:00.000Z",
    fecha_actualizacion: "2025-10-16T11:20:00.000Z",
  },
];

export default function PublicationsMockPage() {
  return (
    <section>
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-700">
          Mock de Publicaciones Pendientes
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Vista estática para validar el diseño y comportamiento de{" "}
          <code>PendingPublicationCard</code>.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          (Las publicaciones activas no se muestran por diseño del componente.)
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPublications.map((p) => (
          <PendingPublicationCard key={p.id_publicacion} publication={p} />
        ))}
      </div>
    </section>
  );
}
