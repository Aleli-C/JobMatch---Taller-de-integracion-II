"use client";
import { useState } from "react";
import Link from "next/link"; // ← NUEVO
import PublicationCard from "../../../components/PublicationCard";

const publicacionesData = [
  { id: 1, titulo: "Ayudante de Mudanza", descripcion: "Necesito apoyo para cargar y descargar muebles en un traslado desde Loncoche hasta Temuco. El trabajo incluye levantar objetos pesados.", icon: "🚚", tipo: "buscar" },
  { id: 2, titulo: "Paseador de Perros", descripcion: "Buscamos a alguien responsable y amante de los animales para pasear 2 perros de raza golden retriever, durante fines de semana y algunos días de semana.", icon: "🐕", tipo: "buscar" },
  { id: 3, titulo: "Cuidado de Niños", descripcion: "Se necesita niñera para cuidar a dos niños menores de 5 años, en las mañanas. El trabajo consiste en preparar colaciones y supervisar su seguridad en todo momento.", icon: "👶", tipo: "buscar" },
  { id: 4, titulo: "Jardinería Básica", descripcion: "Corte de pasto y limpieza de jardín en casa particular. Incluye riego de plantas, mantenimiento de maceteros y poda de arbustos pequeños.", icon: "🌱", tipo: "ofrecer" },
  { id: 5, titulo: "Ayudante de Eventos", descripcion: "Necesitamos apoyo para armar y desarmar mesas y sillas en un evento social. Se requiere disponibilidad para trabajar en equipo, rapidez y responsabilidad en el montaje y desmontaje.", icon: "🎉", tipo: "ofrecer" },
  { id: 6, titulo: "Repartidor en Bicicleta", descripcion: "Entrega de comida rápida en bicicleta dentro del centro de la ciudad, transportarlos de manera segura y entregar puntualmente a los clientes.", icon: "🚴‍♂️", tipo: "buscar" },
  { id: 7, titulo: "Profesor Particular", descripcion: "Clases particulares para estudiantes de enseñanza media en la asignatura de matemáticas. Se valorará paciencia y experiencia previa.", icon: "📚", tipo: "ofrecer" },
  { id: 8, titulo: "Camarero", descripcion: "Atención en cafetería en el centro de la ciudad. El trabajo consiste en tomar pedidos, servir mesas y colaborar en mantener el local limpio y ordenado.", icon: "☕", tipo: "ofrecer" },
  { id: 9, titulo: "Repartidor en Moto", descripcion: "Entrega de pedidos de comida rápida dentro de la ciudad. Se requiere licencia al día, casco propio y disponibilidad para trabajar en horarios flexibles,", icon: "🛵", tipo: "buscar" },
  { id: 10, titulo: "Promotor de Ventas", descripcion: "Promocionar productos en supermercados y ferias locales. El trabajo incluye entregar información sobre las ofertas y fomentar la compra a través de promociones activas.", icon: "🛍️", tipo: "ofrecer" },
  { id: 11, titulo: "Ayudante de Construcción", descripcion: "Apoyo en carga de materiales y limpieza en obras menores. Se requiere disposición para aprender tareas básicas y mantener un entorno de trabajo seguro.", icon: "👷‍♂️", tipo: "buscar" },
  { id: 12, titulo: "Cajero en Minimarket", descripcion: "Atención al cliente y manejo de caja en turno de medio tiempo. El trabajo incluye mantener el orden de productos en góndola y colaborar con tareas generales del local.", icon: "💳", tipo: "ofrecer" },
];

export default function MisPublicaciones() {
  const [publicaciones, setPublicaciones] = useState(publicacionesData);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPub, setEditingPub] = useState<null | typeof publicacionesData[0]>(null);
  const [filtro, setFiltro] = useState<"todo" | "ofrecer" | "buscar">("todo");
  const itemsPerPage = 6;

  // Filtrar publicaciones según filtro
  const filteredPubs =
    filtro === "todo" ? publicaciones : publicaciones.filter((p) => p.tipo === filtro);

  const totalPages = Math.ceil(filteredPubs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredPubs.slice(startIndex, startIndex + itemsPerPage);

  const handleEdit = (pub: typeof publicacionesData[0]) => {
    setEditingPub(pub);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("¿Seguro que quieres eliminar esta publicación?")) {
      setPublicaciones((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const saveEdit = (updated: typeof publicacionesData[0]) => {
    setPublicaciones((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    setEditingPub(null);
  };

   return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-6 py-10">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-blue-600">Mis Publicaciones</h1>
          <nav className="flex gap-2">
            <Link href="/publicaciones/nueva" className="px-3 py-2 bg-blue-600 text-white rounded">Nueva</Link>
            <Link href="/chat" className="px-3 py-2 border rounded">Chat</Link>
            <Link href="/perfil" className="px-3 py-2 border rounded">Perfil</Link>
          </nav>
        </header>

        {/* Filtro */}
        <div className="flex gap-2 mb-6">
          {["todo", "ofrecer", "buscar"].map((tipo) => (
            <button
              key={tipo}
              onClick={() => { setFiltro(tipo as "todo" | "ofrecer" | "buscar"); setCurrentPage(1); }}
              className={`px-4 py-2 rounded ${
                filtro === tipo ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {tipo === "todo" ? "Todas" : tipo === "ofrecer" ? "Ofrecer" : "Buscar"}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentItems.map((pub) => (
            <PublicationCard
              key={pub.id}
              title={pub.titulo}
              description={pub.descripcion}
              icon={pub.icon}
              onEdit={() => handleEdit(pub)}
              onDelete={() => handleDelete(pub.id)}
            />
          ))}
        </div>

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

        {/* Sección de edición */}
        {editingPub && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-20 z-50">
            <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Editar Publicación</h2>
              <input
                type="text"
                className="w-full border p-2 mb-2 rounded"
                value={editingPub.titulo}
                onChange={(e) =>
                  setEditingPub({ ...editingPub, titulo: e.target.value })
                }
              />
              <textarea
                className="w-full border p-2 mb-2 rounded"
                value={editingPub.descripcion}
                onChange={(e) =>
                  setEditingPub({ ...editingPub, descripcion: e.target.value })
                }
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setEditingPub(null)}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => saveEdit(editingPub)}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
