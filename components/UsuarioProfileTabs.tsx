// components/UsuarioProfileTabs.tsx

'use client';

import React, { useState } from 'react';
// Importamos StarRating, que debe existir en la misma carpeta 'components'
import StarRating from './StarRating';
// Importación corregida: Apunta al nuevo UserProvider.tsx en la misma carpeta
import { useUser } from './UserProvider'; 


// Definición de las pestañas
const tabs = [
  { id: 'publicaciones', label: 'Publicaciones' },
  { id: 'completados', label: 'Trabajos Completados' },
  { id: 'resenas', label: 'Reseñas' },
];

/**
 * Componente principal para el área de contenido con pestañas del perfil.
 * Contiene la lógica para las publicaciones simuladas, trabajos completados y gestión de reseñas.
 */
export default function UsuarioProfileTabs() {
  // Obtenemos los datos del usuario del contexto
  const { user } = useUser(); 
  
  // Si user es null (la carga y el error se manejan en UserProvider)
  if (!user) return null;

  // Estado para la pestaña activa
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  // Estados para la lógica de la reseña del usuario (simulación de estado local)
  const [myReview, setMyReview] = useState<{ text: string; rating: number } | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);

  // --- Lógica de Reseñas (Simulación) ---

  const handlePublishReview = () => {
    if (reviewText.trim() && selectedRating > 0) {
      setMyReview({ text: reviewText.trim(), rating: selectedRating });
      setReviewText('');
      setSelectedRating(0);
    }
  };

  const handleEditReview = () => {
    if (!myReview) return;
    setReviewText(myReview.text);
    setSelectedRating(myReview.rating);
    setMyReview(null);
  };

  const handleCancelReview = () => {
    setReviewText('');
    setSelectedRating(0);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'publicaciones':
        return (
          <div className="p-4">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Mis Publicaciones Recientes</h4>
            <div className="space-y-4">
              <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                <p className="font-medium text-gray-900">Diseño de Logo Moderno para Startup</p>
                <p className="text-sm text-gray-600 mt-1">
                  Se completó el proceso de branding para 'TechNova'. Diseño minimalista y escalable en vectores.
                </p>
                <span className="text-xs text-blue-500 block mt-2">hace 3 días</span>
              </div>
              <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                <p className="font-medium text-gray-900">Tutorial de Animación 2D con After Effects</p>
                <p className="text-sm text-gray-600 mt-1">
                  Compartiendo mis mejores trucos para keyframes y renderizado eficiente.
                </p>
                <span className="text-xs text-blue-500 block mt-2">hace 1 semana</span>
              </div>
            </div>
          </div>
        );

      case 'completados':
        return (
          <div className="p-4">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Proyectos Terminados (5)</h4>
            <ul className="space-y-3">
              <li className="flex justify-between items-center p-3 border-b border-gray-100 hover:bg-gray-50 rounded-md">
                <span className="font-medium text-gray-700">Landing Page para E-commerce</span>
                <span className="text-sm text-green-600 font-semibold">Finalizado</span>
              </li>
              <li className="flex justify-between items-center p-3 border-b border-gray-100 hover:bg-gray-50 rounded-md">
                <span className="font-medium text-gray-700">Ilustración para Libro Infantil</span>
                <span className="text-sm text-green-600 font-semibold">Finalizado</span>
              </li>
              <li className="flex justify-between items-center p-3 border-b border-gray-100 hover:bg-gray-50 rounded-md">
                <span className="font-medium text-gray-700">Video Promocional 30s</span>
                <span className="text-sm text-green-600 font-semibold">Finalizado</span>
              </li>
            </ul>
          </div>
        );

      case 'resenas':
        return (
          <div className="p-4">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Reseñas de Clientes (5)</h4>
            
            {/* Formulario/Vista de Reseña Propia */}
            <div className="mb-8 p-4 border border-blue-200 bg-blue-50 rounded-lg">
              <h5 className="font-bold text-lg text-blue-800 mb-3">Tu Reseña sobre {user.nombre}</h5>
              
              {myReview ? (
                // Vista de Reseña Publicada
                <div className="p-4 bg-white rounded-lg shadow-inner">
                  <StarRating rating={myReview.rating} />
                  <p className="text-gray-700 mt-2 italic">"{myReview.text}"</p>
                  <button
                    onClick={handleEditReview}
                    className="mt-3 text-blue-500 hover:text-blue-700 text-sm font-medium"
                  >
                    Editar Reseña
                  </button>
                </div>
              ) : (
                // Formulario de Nueva/Edición de Reseña
                <div className="w-full">
                  <div className="flex items-center mb-4">
                    <span className="font-medium mr-2 text-gray-700">Tu Calificación:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() => setSelectedRating(star)}
                        className={`cursor-pointer text-2xl transition-colors duration-150 ${
                          selectedRating >= star ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <textarea
                    className="w-full h-24 p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Escribe tu reseña aquí..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleCancelReview}
                      className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full hover:bg-gray-400 transition duration-300"
                      type="button"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handlePublishReview}
                      className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-600 transition duration-300 disabled:bg-blue-300"
                      type="button"
                      disabled={!reviewText.trim() || selectedRating === 0}
                    >
                      {myReview ? 'Actualizar' : 'Publicar'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Reseñas de ejemplo */}
            <div className="space-y-4">
              <article className="p-4 border border-gray-200 rounded-lg">
                <p className="text-gray-700 italic">"El trabajo fue entregado a tiempo y superó mis expectativas."</p>
                <div className="text-sm text-gray-500 mt-2 flex items-center justify-between">
                    <StarRating rating={5} />
                    <p className="font-medium text-xs">- Ana M.</p>
                </div>
              </article>
              <article className="p-4 border border-gray-200 rounded-lg">
                <p className="text-gray-700 italic">"Contraté para un diseño de branding y el resultado fue profesional y muy creativo. Totalmente recomendado."</p>
                <div className="text-sm text-gray-500 mt-2 flex items-center justify-between">
                    <StarRating rating={4} />
                    <p className="font-medium text-xs">- Carlos V.</p>
                </div>
              </article>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 min-h-[600px] w-full">
      
      {/* Selector de Pestañas (Tabs) */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'publicaciones' | 'completados' | 'resenas')}
              className={`
                flex-shrink-0 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 
                ${activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600 font-bold'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-transparent'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de la Pestaña Activa */}
      <section>
        {renderContent()}
      </section>
    </div>
  );
}
