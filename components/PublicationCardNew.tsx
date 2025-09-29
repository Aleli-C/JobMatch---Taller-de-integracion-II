import React from "react";
import PublicarTrabajoForm from "./PublicarTrabajoForm";

const PublicationCardNew: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto my-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-[#0069C0] mb-6 text-center">
      </h2>
      <PublicarTrabajoForm />
    </div>
  );
};

export default PublicationCardNew;