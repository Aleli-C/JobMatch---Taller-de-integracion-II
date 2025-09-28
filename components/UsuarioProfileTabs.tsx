// components/UsuarioProfileTabs.tsx

'use client';

import React, { useState } from 'react';
// Importamos StarRating, que debe existir en la misma carpeta 'components'
import StarRating from './StarRating';
// Importación corregida: Ahora traemos useUser directamente desde el nuevo proveedor
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
  const [reviewRating, setReviewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Lógica de Reseñas ---

  const handleReviewSubmit = () => {
    if (!reviewText.trim()) {
      alert("Por favor, escribe un comentario para enviar tu reseña.");
      return;
    }

    setIsSubmitting(true);
    // Simular envío a la API
    setTimeout(() => {
      setMyReview({ text: reviewText, rating: reviewRating });
      setReviewText('');
      setIsSubmitting(false);
      // Opcional: mostrar un mensaje de éxito
      // alert("¡Reseña enviada con éxito!"); 
    }, 1000);
  };
  
  // --- Contenido de las Pestañas ---

  const renderTabContent = () => {
    switch (activeTab) {
      case 'publicaciones':
        return (
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-gray-700">Publicaciones Recientes</h4>
            
            {/* Publicación 1 */}
            <article className="p-4 border border-gray-100 rounded-lg bg-gray-50 hover:shadow-md transition duration-300">
              <h5 className="font-bold text-lg text-blue-600">Busco diseñador para branding de startup</h5>
              <p className="text-sm text-gray-600 mt-1">
                Necesito un profesional para crear la identidad visual completa de mi nueva empresa de tecnología.
              </p>
              <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
                <span>Publicado hace 3 días</span>
                <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Abierto</span>
              </div>
            </article>

            {/* Publicación 2 */}
            <article className="p-4 border border-gray-100 rounded-lg bg-gray-50 hover:shadow-md transition duration-300">
              <h5 className="font-bold text-lg text-blue-600">Clases particulares de Ilustración Digital</h5>
              <p className="text-sm text-gray-600 mt-1">
                Ofrezco mi experiencia para dar clases personalizadas de dibujo digital con Photoshop.
              </p>
              <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
                <span>Publicado hace 1 semana</span>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Clases</span>
              </div>
            </article>
          </div>
        );

      case 'completados':
        return (
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-gray-700">Trabajos Finalizados</h4>
            
            {/* Trabajo 1 */}
            <div className="flex items-center p-4 border rounded-lg bg-gray-50 shadow-sm">
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Diseño de Logo para "AquaTech"</p>
                <p className="text-sm text-gray-500">Servicio de diseño de identidad corporativa.</p>
              </div>
              <span className="text-sm text-green-600 font-bold">Completado</span>
            </div>

            {/* Trabajo 2 */}
            <div className="flex items-center p-4 border rounded-lg bg-gray-50 shadow-sm">
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Creación de 5 banners para campaña de verano</p>
                <p className="text-sm text-gray-500">Proyecto de marketing digital y diseño.</p>
              </div>
              <span className="text-sm text-green-600 font-bold">Completado</span>
            </div>
          </div>
        );

      case 'resenas':
        return (
          <div className="space-y-8">
            <h4 className="text-xl font-semibold text-gray-700">Escribe una Reseña</h4>

            {/* Formulario de Reseña */}
            <div className="p-5 border rounded-lg shadow-inner bg-gray-50">
                <h5 className="font-bold mb-3 text-gray-800">Tu Experiencia</h5>
                {myReview ? (
                    <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4" role="alert">
                        <p className="font-bold">Reseña Enviada</p>
                        <p className="text-sm">Gracias por tu opinión: "{myReview.text}" ({myReview.rating} estrellas).</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <StarRating 
                            rating={reviewRating} 
                            isEditable={true} 
                            onRate={setReviewRating} 
                        />
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            rows={4}
                            placeholder={`¿Qué te pareció el trabajo de ${user.nombre}? Sé detallado...`}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                            disabled={isSubmitting}
                        ></textarea>
                        <button
                            onClick={handleReviewSubmit}
                            disabled={isSubmitting}
                            className="bg-blue-500 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-600 transition duration-300 shadow-md disabled:bg-blue-300"
                        >
                            {isSubmitting ? 'Enviando...' : 'Enviar Reseña'}
                        </button>
                    </div>
                )}
            </div>

            <h4 className="text-xl font-semibold text-gray-700 mt-8">Reseñas de Otros Usuarios</h4>
            <div className="space-y-4">
              {/* Reseña 1 */}
              <article className="p-4 border rounded-lg bg-white shadow-sm">
                <p className="text-gray-700 leading-relaxed text-sm">"Excelente trabajo de ilustración. La comunicación fue fluida y superó mis expectativas."</p>
                <div className="text-sm text-gray-500 mt-2 flex items-center justify-between">
                    <StarRating rating={5} />
                    <p className="font-medium text-xs">- Ana M.</p>
                </div>
              </article>
              {/* Reseña 2 */}
              <article className="p-4 border rounded-lg bg-white shadow-sm">
                <p className="text-gray-700 leading-relaxed text-sm">"Contraté sus servicios de branding y el resultado fue profesional y muy creativo. Totalmente recomendado."</p>
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
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-transparent'
                }`
              }
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de la Pestaña Activa */}
      {renderTabContent()}

    </div>
  );
}
