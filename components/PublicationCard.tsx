"use client";

import { useState } from "react";
import { Edit, Trash2, ChevronRight, MapPin, DollarSign, Briefcase, User } from "lucide-react";
import { Dialog } from "@headlessui/react";

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
}: PublicationCardProps) {
  const [isOpen, setIsOpen] = useState(false);

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
                onClick={onEdit}
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
        </div>

        {/* Botón flotante */}
          <button
            onClick={() => setIsOpen(true)}
            className="absolute bottom-3 right-3 flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium shadow-sm transition-colors"
          >
            Ver detalles
            <ChevronRight className="w-4 h-4" />
          </button>
      </div>

      {/* Modal de detalles */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
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
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cerrar
              </button>
              <button
                onClick={() => alert("Postulación enviada")}
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold text-sm hover:bg-blue-100 transition"
              >
                Enviar postulación
              </button>
            </div>


          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
