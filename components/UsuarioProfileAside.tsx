// components/UsuarioProfileAside.tsx

'use client';

import React, { useState } from 'react';
// Importación corregida: Ahora traemos useUser directamente desde el nuevo proveedor
import { useUser } from './UserProvider'; 

/**
 * Componente que muestra la información resumida del usuario en la barra lateral.
 * Consume los datos del contexto de usuario (UserContext).
 */
const UsuarioProfileAside = () => {
  // Obtenemos los datos del usuario del contexto
  const { user } = useUser();
  
  // Si user es null (la lógica de loading y error se maneja en UserProvider)
  if (!user) return null; 

  const [isFollowing, setIsFollowing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // --- Lógica de Seguir/Dejar de Seguir (Simulación) ---

  const handleFollowClick = () => {
    if (isFollowing) {
      setShowModal(true);
    } else {
      setIsFollowing(true);
    }
  };

  const handleUnfollowConfirm = () => {
    setIsFollowing(false);
    setShowModal(false);
  };

  const handleCancelUnfollow = () => {
    setShowModal(false);
  };

  // --- Renderizado ---

  return (
    <aside className="flex-1 flex flex-col gap-5 min-w-80">
      
      {/* Tarjeta Principal de Información y Botones */}
      <div className="bg-white p-6 rounded-xl shadow-lg text-center">
        <div className="relative w-36 h-36 rounded-full mx-auto mb-4 border-4 border-blue-500">
          <img
            id="profile-img"
            src={user.imagenUrl}
            alt={`Foto de perfil de ${user.nombre}`}
            className="w-full h-full object-cover rounded-full"
            // Placeholder/Fallback para la imagen
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null; 
              target.src = 'https://placehold.co/150x150/cccccc/333333?text=Perfil';
            }}
          />
        </div>
        
        {/* Datos dinámicos del usuario */}
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{user.nombre}</h2>
        <div className="flex items-center justify-center text-yellow-500 mb-4">
          <span className="text-xl mr-1">⭐</span>
          <span className="font-semibold">{user.calificacion.toFixed(1)}</span>
          <span className="text-sm text-gray-500 ml-2">({user.conteoResenas} reseñas)</span>
        </div>

        {/* Botón de acción */}
        <button
          onClick={handleFollowClick}
          className={`w-full py-2 px-4 rounded-full font-bold transition duration-300 transform hover:scale-105 shadow-md 
            ${isFollowing 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-blue-500 text-white hover:bg-blue-600'}`
          }
        >
          {isFollowing ? 'Dejar de Seguir' : 'Seguir Perfil'}
        </button>
      </div>

      {/* Tarjeta de Biografía */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Sobre mí</h3>
        <p className="text-sm text-gray-700 leading-relaxed">{user.descripcion}</p>
      </div>
      
      {/* Tarjeta de Habilidades */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Habilidades Clave</h3>
        <div className="flex flex-wrap gap-2">
          {user.habilidades.map((habilidad, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full shadow-sm"
            >
              {habilidad}
            </span>
          ))}
        </div>
      </div>

      {/* Tarjeta de Contacto */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Contacto</h3>
        <p className="text-sm text-gray-600 mb-1">
          <strong>Correo:</strong> {user.correo}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Teléfono:</strong> {user.telefono}
        </p>
      </div>

      {/* Modal de Confirmación (Simulado) */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 shadow-2xl w-full max-w-sm text-center">
            <p className="text-lg font-semibold mb-4 text-gray-800">¿Dejar de seguir?</p>
            <p className="text-sm text-gray-600 mb-6">¿Estás seguro de que quieres dejar de seguir a {user.nombre}?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleCancelUnfollow}
                className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-full hover:bg-gray-300 transition duration-300"
              >
                No
              </button>
              <button
                onClick={handleUnfollowConfirm}
                className="bg-red-500 text-white font-bold py-2 px-6 rounded-full hover:bg-red-600 transition duration-300 shadow-md"
              >
                Sí, dejar de seguir
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default UsuarioProfileAside;
