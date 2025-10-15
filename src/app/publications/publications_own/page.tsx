// app/publications/publications_own/page.tsx
"use client";

import Link from "next/link";
import { useState, useEffect, useTransition } from "react";
import PublicationCard from "../../../components/PublicationCard";
import OwnPublicationsToolbar from "../../../components/OwnPublicationsToolbar";
import {
  GetPublications,
  UpdatePublication,
  DeletePublication, // ← NUEVO
  type Filtro,
} from "./actions";
import { Dialog } from "@headlessui/react";
import { MapPin, DollarSign, Briefcase, Tag, Calendar } from "lucide-react";

export default function MisPublicaciones() {
  const [publicaciones, setPublicaciones] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPub, setEditingPub] = useState<any | null>(null);
  const [filtro, setFiltro] = useState<Filtro>("todo");
  const [isPending, startTransition] = useTransition();
  const itemsPerPage = 6;

  const toNumber = (v: any): number =>
    typeof v?.toNumber === "function" ? v.toNumber() : Number(v ?? 0);

  const normalize = (arr: any[]) =>
    arr.map((p: any) => ({
      ...p,
      remuneracion: p.remuneracion != null ? toNumber(p.remuneracion) : null,
    }));

  const formatCLP = (v: any) =>
    toNumber(v)
      ? new Intl.NumberFormat("es-CL", {
          style: "currency",
          currency: "CLP",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(toNumber(v))
      : "";

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const data = await GetPublications(filtro);
        if (!cancel) {
          setPublicaciones(normalize(data));
          setCurrentPage(1);
        }
      } catch (e) {
        console.error("Error al cargar publicaciones:", e);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [filtro]);

  const totalPages = Math.ceil(publicaciones.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = publicaciones.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // ====== BORRAR usando Server Action ======
  const handleDelete = (id: number) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta publicación?"))
      return;
    startTransition(async () => {
      const res = await DeletePublication(id);
      if (!res.ok) {
        alert(res.error);
        return;
      }
      // Re-carga desde el servidor respetando el filtro actual
      const data = await GetPublications(filtro);
      setPublicaciones(normalize(data));

      // Ajusta página si quedó fuera de rango
      const newTotalPages = Math.ceil(data.length / itemsPerPage) || 1;
      if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
    });
  };

  // === submit del modal usando el Server Action ===
  const onSubmitEdit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await UpdatePublication(fd);
      if (!res.ok) {
        alert(res.error);
        return;
      }
      const id = Number(fd.get("id"));
      const titulo = String(fd.get("titulo") || "");
      const descripcion = String(fd.get("descripcion") || "");
      setPublicaciones((prev) =>
        prev.map((p) => (p.id === id ? { ...p, titulo, descripcion } : p))
      );
      setEditingPub(null);
    });
  };

  const formatDate = (d: any) =>
    d
      ? new Date(d).toLocaleDateString("es-CL", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-6 py-10">
        <OwnPublicationsToolbar value={filtro} onChange={setFiltro} />

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentItems.map((pub) => {
            const location = [
              pub?.ubicacion?.comuna,
              pub?.ubicacion?.ciudad,
              pub?.ubicacion?.region,
            ]
              .filter(Boolean)
              .join(", ");
            return (
              <PublicationCard
                key={pub.id}
                title={pub.titulo}
                description={pub.descripcion}
                icon={pub.icono}
                location={location || undefined}
                salary={
                  pub.remuneracion ? formatCLP(pub.remuneracion) : undefined
                }
                jobType={pub.tipo}
                category={pub.categoria?.nombre}
                onEdit={() => setEditingPub(pub)}
                onDelete={() => handleDelete(pub.id)} // ← ahora borra en DB
                showDetailsButton={false}
              />
            );
          })}
        </div>

        {/* Paginación */}
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

        {/* Modal edición conectado a la action */}
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

                <form onSubmit={onSubmitEdit} className="space-y-5">
                  <input type="hidden" name="id" value={editingPub.id} />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título
                    </label>
                    <input
                      name="titulo"
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      defaultValue={editingPub.titulo}
                      placeholder="Ej: Desarrollador Full Stack"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      name="descripcion"
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      defaultValue={editingPub.descripcion}
                      placeholder="Describe los detalles de la publicación..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Tag className="w-4 h-4 inline mr-1" />
                        Categoría
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-50"
                        value={editingPub.categoria?.nombre || ""}
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Briefcase className="w-4 h-4 inline mr-1" />
                        Tipo de trabajo
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-50"
                        value={editingPub.tipo || ""}
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Ubicación
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-50"
                        value={[
                          editingPub?.ubicacion?.comuna,
                          editingPub?.ubicacion?.ciudad,
                          editingPub?.ubicacion?.region,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <DollarSign className="w-4 h-4 inline mr-1" />
                        Remuneración
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-50"
                        value={
                          editingPub.remuneracion
                            ? formatCLP(editingPub.remuneracion)
                            : "No especificada"
                        }
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <h3 className="font-medium text-gray-700 mb-3">
                      Información adicional
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Publicado: {formatDate(editingPub.fechaPublicacion)}
                        </span>
                      </div>
                      {editingPub.fechaCierre && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Cierre: {formatDate(editingPub.fechaCierre)}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="font-medium">Estado:</span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            editingPub.estado === "ACTIVO"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {editingPub.estado}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
                      onClick={() => setEditingPub(null)}
                      disabled={isPending}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60"
                      disabled={isPending}
                    >
                      {isPending ? "Guardando..." : "Guardar cambios"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </div>
          </Dialog>
        )}
      </main>
    </div>
  );
}
