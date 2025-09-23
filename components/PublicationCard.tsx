import { Edit, Trash2, ChevronRight, MapPin, DollarSign } from "lucide-react";

type PublicationCardProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
  location?: string;
  salary?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewDetails?: () => void;
};

export default function PublicationCard({
  title, description, icon, location, salary, onEdit, onDelete, onViewDetails,
}: PublicationCardProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between min-h-[230px] hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 flex items-center justify-center text-3xl">{icon}</div>
        <div className="flex-1">
          <h2 className="font-bold text-lg mb-2">{title}</h2>
          <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
          <div className="mt-3 space-y-1">
            {location && <div className="flex items-center text-xs text-gray-500"><MapPin className="w-3 h-3 mr-1" />{location}</div>}
            {salary && <div className="flex items-center text-xs text-gray-500"><DollarSign className="w-3 h-3 mr-1" />{salary}</div>}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between w-full pt-4 border-t border-gray-100 mt-4">
        <div className="flex items-center gap-2">
          {onEdit && (
            <button onClick={onEdit} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium transition-colors">
              <Edit className="w-3 h-3" /> Editar
            </button>
          )}
          {onDelete && (
            <button aria-label={`Eliminar ${title}`} onClick={onDelete} className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
        {onViewDetails && (
          <button onClick={onViewDetails} className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition-colors">
            Ver detalles <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
