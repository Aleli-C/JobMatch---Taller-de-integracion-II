'use client';

import React, { useState } from 'react';
// Importamos StarRating, que debe existir en la misma carpeta 'components'
import StarRating from './StarRating';
// Importamos el hook useUser desde la ruta corregida para acceder al contexto.
// NOTA: Ajusta esta ruta si la estructura real de tu proyecto es diferente a (components/ -> app/profile/page.tsx)
import { useUser } from '../../app/profile/page'; 

// Definición de las pestañas originales
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
  // Se asume que 'user' contiene: { name, email, bio, createdAt }
  const { user } = useUser(); 
  
  // Estado para la pestaña activa
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  // Estados para la lógica de la reseña del usuario (simulación de estado local)
  const [myReview, setMyReview] = useState<{ text: string; rating: number } | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);

  // Manejadores de la reseña
  const handlePublishReview = () => {
    if (reviewText && selectedRating > 0) {
      // Simulación de publicación: guarda la reseña localmente
      setMyReview({ text: reviewText, rating: selectedRating });
      setReviewText('');
      setSelectedRating(0);
    }
  };

  const handleEditReview = () => {
    // Carga la reseña existente al formulario para edición
    if (myReview) {
      setReviewText(myReview.text);
      setSelectedRating(myReview.rating);
      setMyReview(null); // Oculta la reseña publicada mientras se edita
    }
  };

  const handleCancelReview = () => {
    // Limpia el formulario y, si había una reseña publicada antes de editar, la restablece
    setReviewText('');
    setSelectedRating(0);
    // Para simplificar, asumimos que si se cancela, se quería volver al estado original
    // (En una app real, la lógica de edición/cancelación sería más robusta)
  };

  // El contenido principal de las pestañas
  const renderTabContent = () => {
    if (!user) {
      return (
        <div className="p-6 text-center text-gray-500">
          Cargando datos del usuario...
        </div>
      );
    }

    switch (activeTab) {
      case 'publicaciones':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Publicaciones de {user.name}</h3>
            {/* PUBLICACIÓN SIMULADA 1 */}
            <article className="bg-gray-50 p-6 rounded-lg shadow-sm mb-4 border border-gray-100">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Necesito un diseñador de logos</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                Busco a alguien para crear un logo profesional para mi nueva empresa de consultoría. El estilo debe ser minimalista y moderno.
              </p>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>🗓️ Publicado hace 2 horas</span>
                <span>📍 Santiago, Chile</span>
              </div>
            </article>
            {/* PUBLICACIÓN SIMULADA 2 */}
            <article className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Ofrezco servicios de fotografía de eventos</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                Fotógrafo profesional con equipo de alta gama disponible para eventos, bodas y sesiones corporativas. Incluye edición y entrega digital.
              </p>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>🗓️ Publicado hace 1 día</span>
                <span>📍 Valparaíso, Chile</span>
              </div>
            </article>
          </div>
        );

      case 'completados':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Trabajos Completados por {user.name}</h3>
            {/* TRABAJO COMPLETADO SIMULADO 1 */}
            <article className="bg-gray-50 p-6 rounded-lg shadow-sm mb-4 border border-gray-100">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Proyecto de Diseño Web para Empresa X</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                Proyecto de 3 semanas en el que se desarrolló un sitio web corporativo completo, desde el wireframing hasta la implementación final.
              </p>
              <div className="text-sm text-gray-500 mt-2">
                <p><strong>Cliente:</strong> Empresa X</p>
                <p><strong>Fecha:</strong> Septiembre 2024</p>
              </div>
            </article>
            {/* TRABAJO COMPLETADO SIMULADO 2 */}
            <article className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Sesión Fotográfica de Producto</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                Fotografías de alta resolución para el catálogo de productos de una tienda de ropa en línea.
              </p>
              <div className="text-sm text-gray-500 mt-2">
                <p><strong>Cliente:</strong> Tienda de Ropa Z</p>
                <p><strong>Fecha:</strong> Octubre 2024</p>
              </div>
            </article>
          </div>
        );

      case 'resenas':
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Reseñas y Calificaciones</h3>
            
            {/* Sección de la reseña del usuario actual */}
            {myReview ? (
              <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-6 border border-blue-200">
                <p className="text-base font-bold text-blue-800 mb-1">Tu Reseña</p>
                <p className="text-sm text-gray-700 italic mt-2">"{myReview.text}"</p>
                <StarRating rating={myReview.rating} />
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleEditReview}
                    className="bg-gray-200 text-gray-800 font-bold py-1 px-3 rounded-full hover:bg-gray-300 transition duration-300 text-sm shadow-sm"
                  >
                    Editar Reseña
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
                <p className="text-base font-semibold mb-3 text-gray-700">Escribe una reseña para {user.name}:</p>
                
                <div className="mb-3">
                    <StarRating 
                        rating={selectedRating} 
                        setRating={setSelectedRating} 
                        isEditable={true} 
                    />
                </div>
                
                <textarea
                  className="w-full h-24 p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Escribe tu reseña aquí..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                ></textarea>
                <div className="flex justify-end gap-3">
                  {(reviewText || selectedRating > 0) && (
                    <button
                      onClick={handleCancelReview}
                      className="bg-gray-100 text-gray-600 font-bold py-2 px-4 rounded-full hover:bg-gray-200 transition duration-300 shadow-sm text-sm"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    onClick={handlePublishReview}
                    disabled={!reviewText || selectedRating === 0}
                    className={`text-white font-bold py-2 px-4 rounded-full transition duration-300 text-sm shadow-md
                        ${(!reviewText || selectedRating === 0) 
                            ? 'bg-blue-300 cursor-not-allowed' 
                            : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                  >
                    Publicar Reseña
                  </button>
                </div>
              </div>
            )}
            
            {/* Lista de reseñas (Simuladas) */}
            <div id="reviews-list" className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-700 pt-2 border-t border-gray-100">Otras Reseñas</h4>
              <article className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                <p className="text-sm text-gray-700 italic">"Increíble trabajo y atención al detalle. Mi logo quedó exactamente como lo imaginé. Un profesional muy recomendable."</p>
                <div className="text-sm text-gray-500 mt-2 flex items-center justify-between">
                    <StarRating rating={5} />
                    <p className="font-medium text-xs">- Sofía R.</p>
                </div>
              </article>
              <article className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                <p className="text-sm text-gray-700 italic">"Muy buena comunicación y siempre dispuesto a escuchar mis ideas. El sitio web se entregó a tiempo y superó mis expectativas."</p>
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
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-shrink-0 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 
                ${activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600 font-bold'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-b-2 border-transparent'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de la Pestaña Activa */}
      <div className="mt-6">
        {renderTabContent()}
      </div>
    </div>
  );
}
