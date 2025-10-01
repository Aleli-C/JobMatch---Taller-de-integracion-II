//app/publications/publications_own/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastProvider } from "../../../components/ToastContext";
import PublicationCard from "../../../components/PublicationCard";
import PublicationCardNew from "../../../components/PublicationCardNew";
import Button from "../../../components/button";
import { GetPublications } from "./actions";
import { Dialog } from "@headlessui/react";
import { MapPin, DollarSign, Briefcase, Tag, Calendar } from "lucide-react";

export default function MisPublicaciones() {
  const [publicaciones, setPublicaciones] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPub, setEditingPub] = useState<any | null>(null);
  const [filtro, setFiltro] = useState<"todo" | "ofrecer" | "buscar">("todo");
  const [showNewForm, setShowNewForm] = useState(false);
  const itemsPerPage = 6;
  const router = useRouter();

  // 🔹 Función para convertir Decimal a número
  const toNumber = (v: any): number => {
    if (v === null || v === undefined) return 0;
    if (typeof v?.toNumber === "function") return v.toNumber();
    return Number(v);
  };

  // 🔹 Función para formatear precio en CLP con separadores de miles
  const formatCLP = (v: any): string => {
    const n = toNumber(v);
    if (n === 0) return "";
    return new Intl.NumberFormat("es-CL", { 
      style: "currency", 
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(n);
  };

  // 🔹 Cargar publicaciones desde el server action
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await GetPublications();
        
        // Normalizar datos y convertir Decimals
        const normalizedData = data.map((pub: any) => {
          // Convertir todos los posibles campos Decimal
          const normalized: any = {
            ...pub,
            remuneracion: pub.remuneracion ? toNumber(pub.remuneracion) : null,
          };

          // Si hay campos anidados con Decimals, también convertirlos
          if (pub.ubicacion && typeof pub.ubicacion === 'object') {
            normalized.ubicacion = { ...pub.ubicacion };
          }
          if (pub.categoria && typeof pub.categoria === 'object') {
            normalized.categoria = { ...pub.categoria };
          }

          return normalized;
        });
        
        setPublicaciones(normalizedData);
      } catch (error) {
        console.error("Error al cargar publicaciones:", error);
      }
    }
    fetchData();
  }, []);

  // 🔹 Filtrar publicaciones
  const filteredPubs =
    filtro === "todo" ? publicaciones : publicaciones.filter((p) => p.tipo === filtro);

  // 🔹 Paginación
  const totalPages = Math.ceil(filteredPubs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredPubs.slice(startIndex, startIndex + itemsPerPage);

  // 🔹 Editar publicación
  const handleEdit = (pub: any) => {
    setEditingPub(pub);
  };

  // 🔹 Eliminar publicación (solo frontend por ahora)
  const handleDelete = (id: number) => {
    if (window.confirm("¿Seguro que quieres eliminar esta publicación?")) {
      setPublicaciones((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // 🔹 Guardar edición (solo frontend)
  const saveEdit = (updated: any) => {
    setPublicaciones((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    setEditingPub(null);
  };

  // 🔹 Formatear fecha
  const formatDate = (date: any) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("es-CL", { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-6 py-10">
          {/* 🔹 Filtro */}
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

          {/* 🔹 Botón crear publicación */}
          <div className="flex justify-start mb-8">
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowNewForm(true)}
            >
              Crear nueva publicación
            </Button>
          </div>

          {/* 🔹 Modal nueva publicación */}
          {showNewForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
              <div className="relative">
                <PublicationCardNew />
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  onClick={() => setShowNewForm(false)}
                  aria-label="Cerrar"
                >
                  &times;
                </button>
              </div>
            </div>
          )}

          {/* 🔹 Lista de publicaciones */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentItems.map((pub) => (
              <PublicationCard
                key={pub.id}
                title={pub.titulo}
                description={pub.descripcion}
                icon={pub.icono}
                location={pub.ubicacion?.ciudad ? 
                  `${pub.ubicacion.ciudad}${pub.ubicacion?.region ? `, ${pub.ubicacion.region}` : ""}` 
                  : undefined}
                salary={pub.remuneracion ? formatCLP(pub.remuneracion) : undefined}
                jobType={pub.tipo}
                category={pub.categoria?.nombre}
                onEdit={() => handleEdit(pub)}
                onDelete={() => handleDelete(pub.id)}
                showDetailsButton={false}
              />
            ))}
          </div>

          {/* 🔹 Paginación */}
          {totalPages > 1 && (
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
          )}

          {/* 🔹 Modal de edición mejorado */}
          {editingPub && (
            <Dialog 
              open={!!editingPub} 
              onClose={() => setEditingPub(null)} 
              className="relative z-50"
            >
              <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                  <Dialog.Title className="text-2xl font-bold mb-6 text-gray-800">
                    Editar Publicación
                  </Dialog.Title>
                  
                  <div className="space-y-5">
                    {/* Título */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={editingPub.titulo}
                        onChange={(e) =>
                          setEditingPub({ ...editingPub, titulo: e.target.value })
                        }
                        placeholder="Ej: Desarrollador Full Stack"
                      />
                    </div>

                    {/* Descripción */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción
                      </label>
                      <textarea
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        value={editingPub.descripcion}
                        onChange={(e) =>
                          setEditingPub({ ...editingPub, descripcion: e.target.value })
                        }
                        placeholder="Describe los detalles de la publicación..."
                      />
                    </div>

                    {/* Grid de 2 columnas para campos más pequeños */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Categoría */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Tag className="w-4 h-4 inline mr-1" />
                          Categoría
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={editingPub.categoria?.nombre || ""}
                          readOnly
                          placeholder="Sin categoría"
                        />
                      </div>

                      {/* Tipo de trabajo */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Briefcase className="w-4 h-4 inline mr-1" />
                          Tipo de trabajo
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={editingPub.tipo || ""}
                          readOnly
                          placeholder="No especificado"
                        />
                      </div>

                      {/* Ubicación */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <MapPin className="w-4 h-4 inline mr-1" />
                          Ubicación
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={editingPub.ubicacion?.ciudad ? 
                            `${editingPub.ubicacion.ciudad}${editingPub.ubicacion?.region ? `, ${editingPub.ubicacion.region}` : ""}` 
                            : ""}
                          readOnly
                          placeholder="Sin ubicación"
                        />
                      </div>

                      {/* Remuneración */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <DollarSign className="w-4 h-4 inline mr-1" />
                          Remuneración
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={editingPub.remuneracion ? formatCLP(editingPub.remuneracion) : "No especificada"}
                          readOnly
                        />
                      </div>
                    </div>

                    {/* Información adicional */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <h3 className="font-medium text-gray-700 mb-3">Información adicional</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Publicado: {formatDate(editingPub.fechaPublicacion)}</span>
                        </div>
                        {editingPub.fechaCierre && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Cierre: {formatDate(editingPub.fechaCierre)}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="font-medium">Estado:</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            editingPub.estado === 'ACTIVA' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {editingPub.estado}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                    <button
                      className="px-5 py-2.5 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
                      onClick={() => setEditingPub(null)}
                    >
                      Cancelar
                    </button>
                    <button
                      className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm"
                      onClick={() => saveEdit(editingPub)}
                    >
                      Guardar cambios
                    </button>
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>
          )}
        </main>
      </div>
    </ToastProvider>
  );
}