// components/UsuarioProfileTabs.tsx
'use client';

import React, { useState } from 'react';
import { useUser } from './UserProvider';

const tabs = [
  { id: 'publicaciones', label: 'Publicaciones' },
  { id: 'completados', label: 'Trabajos Completados' },
  { id: 'resenas', label: 'Reseñas' },
];

export default function UsuarioProfileTabs() {
  const { user } = useUser();
  if (!user) return null;

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const renderContent = () => {
    switch (activeTab) {
      case 'publicaciones':
        return (
          <div className="p-4">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Mis Publicaciones</h4>
            <p className="text-sm text-gray-500">Sin publicaciones.</p>
          </div>
        );
      case 'completados':
        return (
          <div className="p-4">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Trabajos Completados</h4>
            <p className="text-sm text-gray-500">Sin trabajos completados.</p>
          </div>
        );
      case 'resenas':
        return (
          <div className="p-4">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Reseñas</h4>
            <p className="text-sm text-gray-500">Aún no tienes reseñas.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 min-h-[600px] w-full">
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'publicaciones' | 'completados' | 'resenas')}
              className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600 font-bold'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <section>{renderContent()}</section>
    </div>
  );
}
