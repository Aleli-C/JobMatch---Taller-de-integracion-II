"use client";
import { useState } from "react";
import Header from "../../../components/header";
import Footer from "../../../components/footer";
import PublicationCardNew from "../../../components/PublicationCardNew";
import { ToastProvider } from "../../../components/ToastContext";
// import PublicarServicioForm from "../../../components/PublicarServicioForm"; // <-- Descomenta cuando esté listo

export default function PublicationsNewPage() {
  const [selectedForm, setSelectedForm] = useState<"trabajo" | "servicio">("trabajo");

  return (
    <ToastProvider>
      <main className="max-w-3xl mx-auto px-4 py-10 min-h-[70vh] flex flex-col items-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">
        </h1>
        <div className="flex gap-4 mb-8">
          <button
            className={`px-6 py-2 rounded-lg font-semibold border transition ${
              selectedForm === "trabajo"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
            }`}
            onClick={() => setSelectedForm("trabajo")}
          >
            Publicar Trabajo
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-semibold border transition ${
              selectedForm === "servicio"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
            }`}
            onClick={() => setSelectedForm("servicio")}
            disabled
            title="Próximamente"
          >
            Publicar Servicio
          </button>
        </div>
        {selectedForm === "trabajo" && <PublicationCardNew />}
        {selectedForm === "servicio" && (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 text-center text-gray-500">
            El formulario para publicar servicio estará disponible próximamente.
          </div>
        )}
      </main>
      <Footer />
    </ToastProvider>
  );
}