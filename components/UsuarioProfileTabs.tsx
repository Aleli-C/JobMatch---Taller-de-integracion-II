'use client';

import React, { useState } from 'react';
import StarRating from './StarRating';

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState('publicaciones');
  const [myReview, setMyReview] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);

  const handlePublishReview = () => {
    if (reviewText && selectedRating > 0) {
      setMyReview({ text: reviewText, rating: selectedRating });
      setReviewText('');
      setSelectedRating(0);
    }
  };

  const handleEditReview = () => {
    setReviewText(myReview.text);
    setSelectedRating(myReview.rating);
    setMyReview(null);
  };

  const handleCancelReview = () => {
    setReviewText('')
    setSelectedRating(0);
  };

  const isEditing = myReview === null && reviewText !== '';

  return (
    <section className="flex-[2] bg-white p-8 rounded-lg shadow-md">
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('publicaciones')}
          className={`font-bold border-b-2 px-4 py-2 transition ${
            activeTab === 'publicaciones'
              ? 'text-blue-500 border-blue-500'
              : 'text-gray-500 border-transparent hover:text-blue-500 hover:border-blue-500'
          }`}
        >
          Publicaciones
        </button>
        <button
          onClick={() => setActiveTab('completados')}
          className={`font-bold border-b-2 px-4 py-2 transition ${
            activeTab === 'completados'
              ? 'text-blue-500 border-blue-500'
              : 'text-gray-500 border-transparent hover:text-blue-500 hover:border-blue-500'
          }`}
        >
          Trabajos Completados
        </button>
        <button
          onClick={() => setActiveTab('resenas')}
          className={`font-bold border-b-2 px-4 py-2 transition ${
            activeTab === 'resenas'
              ? 'text-blue-500 border-blue-500'
              : 'text-gray-500 border-transparent hover:text-blue-500 hover:border-blue-500'
          }`}
        >
          Reseñas
        </button>
      </div>

      <div className="tab-content-container">
        {activeTab === 'publicaciones' && (
          <div>
            <article className="bg-gray-50 p-6 rounded-lg shadow-sm mb-4">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Necesito un diseñador de logos</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                Busco a alguien para crear un logo profesional para mi nueva empresa de consultoría. El estilo debe ser minimalista y moderno.
              </p>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>🗓️ Publicado hace 2 horas</span>
                <span>📍 Santiago, Chile</span>
              </div>
            </article>
            <article className="bg-gray-50 p-6 rounded-lg shadow-sm">
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
        )}

        {activeTab === 'completados' && (
          <div>
            <article className="bg-gray-50 p-6 rounded-lg shadow-sm mb-4">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Proyecto de Diseño Web para Empresa X</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                Proyecto de 3 semanas en el que se desarrolló un sitio web corporativo completo, desde el wireframing hasta la implementación final.
              </p>
              <div className="text-sm text-gray-500">
                <p>
                  <strong>Cliente:</strong> Empresa X
                </p>
                <p>
                  <strong>Fecha:</strong> Septiembre 2024
                </p>
              </div>
            </article>
            <article className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Sesión Fotográfica de Producto</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                Fotografías de alta resolución para el catálogo de productos de una tienda de ropa en línea. Se entregaron 50 fotos editadas.
              </p>
              <div className="text-sm text-gray-500">
                <p>
                  <strong>Cliente:</strong> Tienda de Ropa Z
                </p>
                <p>
                  <strong>Fecha:</strong> Octubre 2024
                </p>
              </div>
            </article>
          </div>
        )}

        {activeTab === 'resenas' && (
          <div>
            {myReview ? (
              <div className="bg-blue-100 p-6 rounded-lg shadow-md mb-4">
                <p className="text-sm font-bold text-blue-800">Tu Reseña</p>
                <p className="text-sm text-gray-700 italic mt-2">"{myReview.text}"</p>
                <StarRating rating={myReview.rating} />
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleEditReview}
                    className="bg-gray-200 text-gray-800 font-bold py-1 px-3 rounded-full hover:bg-gray-300 transition duration-300"
                  >
                    Editar
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md mb-4">
                <p className="text-sm font-semibold mb-2">Escribe tu reseña:</p>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star-icon text-2xl cursor-pointer ${
                        star <= selectedRating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      onClick={() => setSelectedRating(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <textarea
                  className="w-full h-24 p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Escribe tu reseña aquí..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                ></textarea>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleCancelReview}
                    className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-full hover:bg-gray-300 transition duration-300"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handlePublishReview}
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-600 transition duration-300"
                  >
                    Publicar
                  </button>
                </div>
              </div>
            )}
            
            <div id="reviews-list">
              <article className="bg-gray-50 p-6 rounded-lg shadow-sm mb-4">
                <p className="text-sm text-gray-700 italic">"Increíble trabajo y atención al detalle. Mi logo quedó exactamente como lo imaginé. Un profesional muy recomendable."</p>
                <div className="text-sm text-gray-500 mt-2">
                  <StarRating rating={5} />
                  <p>- **Sofía R.**</p>
                </div>
              </article>
              <article className="bg-gray-50 p-6 rounded-lg shadow-sm mb-4">
                <p className="text-sm text-gray-700 italic">"Muy buena comunicación y siempre dispuesto a escuchar mis ideas. El sitio web se entregó a tiempo y superó mis expectativas."</p>
                <div className="text-sm text-gray-500 mt-2">
                  <StarRating rating={4} />
                  <p>- **Carlos V.**</p>
                </div>
              </article>
              <article className="bg-gray-50 p-6 rounded-lg shadow-sm mb-4">
                <p className="text-sm text-gray-700 italic">"Contraté a [Nombre de Usuario] para un proyecto de ilustración. Su talento es excepcional y el resultado fue incluso mejor de lo que imaginé. Totalmente recomendado."</p>
                <div className="text-sm text-gray-500 mt-2">
                  <StarRating rating={5} />
                  <p>- **Ana P.**</p>
                </div>
              </article>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfileTabs;