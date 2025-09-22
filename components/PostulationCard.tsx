import { ChevronRight, CheckCircle2, Clock, XCircle, MapPin, DollarSign } from "lucide-react";
import { useState } from "react";

type Status = "accepted" | "pending" | "rejected";

type PostulationCardProps = {
  title: string;
  description: string;
  payment: string;
  location: string;
  date: string;
  message: string;
  status: Status;
};

export default function PostulationCard({
  title,
  description,
  payment,
  location,
  date,
  message,
  status,
}: PostulationCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const renderStatusIcon = () => {
    switch (status) {
      case "accepted":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between min-h-[200px] hover:shadow-lg transition-shadow">
      {/* Card resumida */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-bold text-lg mb-1">{title}</h2>
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        </div>
        {renderStatusIcon()}
      </div>

      <div className="flex items-center justify-between w-full pt-4 border-t border-gray-100 mt-4">
        <p className="text-sm text-gray-500">{payment}</p>
        <button
          onClick={() => setShowDetails(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition-colors"
        >
          Ver detalles
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Card detallada */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md relative">
            <button
              onClick={() => setShowDetails(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h2 className="font-bold text-xl mb-2">{title}</h2>
            <p className="text-gray-700 mb-4">{description}</p>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> {payment}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {location}
              </div>
              <div className="flex items-center gap-2">
                📅 Fecha de postulación: {date}
              </div>
              <div className="mt-3">
                <p className="font-medium">Mensaje enviado:</p>
                <p className="text-gray-700">{message}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
