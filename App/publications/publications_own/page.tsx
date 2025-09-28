"use client";

import { useEffect, useState } from "react";
import { GetPublications } from "./actions"; 
import PublicationCard from "@/components/PublicationCard";

interface Publicacion {
  id: number;
  titulo: string;
  descripcion: string;
  icono: string | null;
  tipo: string;
}

export default function MisPublicaciones() {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPub, setEditingPub] = useState<Publicacion | null>(null);
  const [filtro, setFiltro] = useState<"todo" | "ofrecer" | "buscar">("todo");
  const itemsPerPage = 6;

  // cargar publicaciones desde la BD
  useEffect(() => {
    (async () => {
      try {
        const data = await GetPublications();
        setPublicaciones(data);
      } catch (error) {
        console.error("Error cargando publicaciones", error);
      }
    })();
  }, []);

  // Filtrar según "tipo"
  const filteredPubs =
    filtro === "todo" ? publicaciones : publicaciones.filter((p) => p.tipo.toLowerCase() === filtro);

  const totalPages = Math.ceil(filteredPubs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredPubs.slice(startIndex, startIndex + itemsPerPage);

  const handleEdit = (pub: Publicacion) => {
    setEditingPub(pub);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("¿Seguro que quieres eliminar esta publicación?")) {
      setPublicaciones((prev) => prev.filter((p) => p.id !== id));
      // ⚠️ luego lo conectamos a deletePublicationAction para borrar en BD
    }
  };

  const saveEdit = (updated: Publicacion) => {
    setPublicaciones((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    setEditingPub(null);
    // ⚠️ luego lo conectamos a updatePublicationAction para guardar en BD
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Filtro */}
        <div className="flex gap-2 mb-6">
          {["todo", "ofrecer", "buscar"].map((tipo) => (
            <button
              key={tipo}
              onClick={() => {
                setFiltro(tipo as "todo" | "ofrecer" | "buscar");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded ${
                filtro === tipo
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {tipo === "todo"
                ? "Todas"
                : tipo === "ofrecer"
                ? "Ofrecer"
                : "Buscar"}
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
              icon={pub.icono ?? "📌"}
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

        {/* Modal edición */}
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
