"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PublicationCard from "../../../components/PublicationCard";
import Button from "../../../components/button";
import { ToastProvider, useToastContext } from "../../../components/ToastContext";

function MisPublicacionesContent() {
  const [publicaciones, setPublicaciones] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPub, setEditingPub] = useState<null | any>(null);
  const [filtro, setFiltro] = useState<"todo" | "ofrecer" | "buscar">("todo");
  const itemsPerPage = 6;
  const router = useRouter();
  const { addToast } = useToastContext();

  // Cargar publicaciones desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem("publicaciones");
    if (saved) setPublicaciones(JSON.parse(saved));
  }, []);

  const saveToStorage = (newData: any[]) => {
    setPublicaciones(newData);
    localStorage.setItem("publicaciones", JSON.stringify(newData));
  };

  const filteredPubs = filtro === "todo" ? publicaciones : publicaciones.filter((p) => p.tipo === filtro);
  const totalPages = Math.ceil(filteredPubs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredPubs.slice(startIndex, startIndex + itemsPerPage);

  const handleEdit = (pub: any) => setEditingPub(pub);

  const handleDelete = (id: number) => {
    if (window.confirm("¿Seguro que quieres eliminar esta publicación?")) {
      const updated = publicaciones.filter((p) => p.id !== id);
      saveToStorage(updated);
      addToast({ type: "SUCCESS", title: "Publicación eliminada", message: "La publicación ha sido eliminada.", timestamp: new Date() });
    }
  };

  const saveEdit = (updated: any) => {
    const newData = publicaciones.map((p) => (p.id === updated.id ? updated : p));
    saveToStorage(newData);
    setEditingPub(null);
    addToast({ type: "POST_UPDATED", title: "Publicación editada", message: "La publicación se ha actualizado.", timestamp: new Date() });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Filtro */}
        <div className="flex gap-2 mb-6">
          {["todo", "ofrecer", "buscar"].map((tipo) => (
            <button
              key={tipo}
              onClick={() => { setFiltro(tipo as "todo" | "ofrecer" | "buscar"); setCurrentPage(1); }}
              className={`px-4 py-2 rounded ${filtro === tipo ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
            >
              {tipo === "todo" ? "Todas" : tipo === "ofrecer" ? "Ofrecer" : "Buscar"}
            </button>
          ))}
        </div>

        {/* Botón Crear -> redirige a otra vista */}
        <div className="flex justify-start mb-8">
          <Button
            variant="primary"
            size="md"
            onClick={() => router.push("/publications/publications_new")}
          >
            Crear nueva publicación
          </Button>
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
              className={`px-3 py-1 rounded-md border ${currentPage === page ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Sección edición */}
        {editingPub && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-20 z-50">
            <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Editar Publicación</h2>
              <input
                type="text"
                className="w-full border p-2 mb-2 rounded"
                value={editingPub.titulo}
                onChange={(e) => setEditingPub({ ...editingPub, titulo: e.target.value })}
              />
              <textarea
                className="w-full border p-2 mb-2 rounded"
                value={editingPub.descripcion}
                onChange={(e) => setEditingPub({ ...editingPub, descripcion: e.target.value })}
              />
              <div className="flex justify-end gap-2 mt-4">
                <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={() => setEditingPub(null)}>Cancelar</button>
                <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={() => saveEdit(editingPub)}>Guardar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function MisPublicaciones() {
  return (
    <ToastProvider>
      <MisPublicacionesContent />
    </ToastProvider>
  );
}