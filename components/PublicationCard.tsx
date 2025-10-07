//components/PublicationCard.tsx
"use client";

import { useState } from "react";
import { Edit, Trash2, ChevronRight, MapPin, DollarSign, Briefcase, User } from "lucide-react";
import { Dialog } from "@headlessui/react";

// components/PublicationCard.tsx
type PublicationCardProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
  location?: string;
  salary?: string;
  jobType?: string;
  category?: string;
  author?: { nombre: string; tipoUsuario: string };
  onEdit?: () => void;
  onDelete?: () => void;
  showDetailsButton?: boolean;
  /** NUEVO: true si la publicación es del usuario en sesión */
  isOwner?: boolean;
};

export default function PublicationCard({
  title,
  description,
  icon,
  location,
  salary,
  jobType,
  category,
  author,
  onEdit,
  onDelete,
  showDetailsButton = true,
  isOwner = false, // ← default
}: PublicationCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEditClick = () => {
    if (onEdit) {
      // Si hay un handler personalizado, lo usamos (para publications_own)
      onEdit();
    } else {
      // Si no, abrimos el modal de detalles de edición
      setIsEditOpen(true);
    }
  };

  return (
    <>
      {/* Card */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between min-h-[230px] hover:shadow-lg transition-shadow relative">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 flex items-center justify-center text-3xl">{icon}</div>
          <div className="flex-1">
            <h2 className="font-bold text-lg mb-2">{title}</h2>
            <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
            <div className="mt-3 space-y-1">
              {location && (
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="w-3 h-3 mr-1" />
                  {location}
                </div>
              )}
              {salary && (
                <div className="flex items-center text-xs text-gray-500">
                  <DollarSign className="w-3 h-3 mr-1" />
                  {salary}
                </div>
              )}
              {jobType && (
                <div className="flex items-center text-xs text-gray-500">
                  <Briefcase className="w-3 h-3 mr-1" />
                  {jobType}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between w-full pt-4 border-t border-gray-100 mt-4 relative">
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={handleEditClick}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium transition-colors"
              >
                <Edit className="w-3 h-3" /> Editar
              </button>
            )}
            {onDelete && (
              <button
                aria-label={`Eliminar ${title}`}
                onClick={onDelete}
                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Botón flotante - solo se muestra si showDetailsButton es true */}
          {showDetailsButton && (
            <button
              onClick={() => setIsDetailsOpen(true)}
              className="absolute bottom-3 right-3 flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium shadow-sm transition-colors"
            >
              Ver detalles
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Modal de detalles (para publications_view) */}
      <Dialog open={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 space-y-4">
            <Dialog.Title className="text-lg font-bold">{title}</Dialog.Title>
            <div className="space-y-2 text-sm text-gray-600">
              {author && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>
                    Publicado por <strong>{author.nombre}</strong>
                  </span>
                </div>
              )}
              {category && (
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  <span>Categoría: {category}</span>
                </div>
              )}
              {jobType && (
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  <span>Tipo: {jobType}</span>
                </div>
              )}
              {location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{location}</span>
                </div>
              )}
              {salary && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span>{salary}</span>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-medium mt-4">Descripción</h3>
              <p className="text-gray-700 text-sm whitespace-pre-line">{description}</p>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cerrar
              </button>
              {!isOwner && (
            <button
              onClick={() => alert("Postulación enviada")}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold text-sm hover:bg-blue-100 transition"
            >
              Enviar postulación
            </button>
          )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Modal de edición con todos los detalles (para cuando no hay onEdit personalizado) */}
      <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 space-y-4">
            <Dialog.Title className="text-lg font-bold">Detalles de la Publicación</Dialog.Title>
            
            <div className="space-y-3 text-sm">
              <div>
                <label className="font-medium text-gray-700">Título</label>
                <p className="text-gray-600 mt-1">{title}</p>
              </div>

              {author && (
                <div>
                  <label className="font-medium text-gray-700">Publicado por</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">
                      <strong>{author.nombre}</strong> ({author.tipoUsuario})
                    </span>
                  </div>
                </div>
              )}

              {category && (
                <div>
                  <label className="font-medium text-gray-700">Categoría</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{category}</span>
                  </div>
                </div>
              )}

              {jobType && (
                <div>
                  <label className="font-medium text-gray-700">Tipo de trabajo</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{jobType}</span>
                  </div>
                </div>
              )}

              {location && (
                <div>
                  <label className="font-medium text-gray-700">Ubicación</label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{location}</span>
                  </div>
                </div>
              )}

              {salary && (
                <div>
                  <label className="font-medium text-gray-700">Remuneración</label>
                  <div className="flex items-center gap-2 mt-1">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{salary}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="font-medium text-gray-700">Descripción</label>
                <p className="text-gray-600 text-sm whitespace-pre-line mt-1">{description}</p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cerrar
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}