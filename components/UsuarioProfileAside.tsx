// components/UsuarioProfileAside.tsx

'use client';

import React, { useState } from 'react';
// Importación corregida: Apunta al nuevo UserProvider.tsx en la misma carpeta
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
      <div className="bg-white p-6 rounded-xl shadow-lg text-center">
        <div className="relative w-36 h-36 rounded-full mx-auto mb-4 border-4 border-blue-500">
          <img
            id="profile-img"
            // Datos dinámicos: user.imagenUrl
            src={user.imagenUrl} 
            alt={`Foto de perfil de ${user.nombre}`}
            className="w-full h-full rounded-full object-cover p-2 bg-gray-200"
          />
        </div>
        {/* Datos dinámicos: user.nombre */}
        <h2 className="text-2xl font-bold mb-1">{user.nombre}</h2>
        {/* Datos dinámicos: user.descripcion */}
        <p className="text-sm text-gray-500 leading-relaxed mb-4">
          {user.descripcion}
        </p>
        <div className="text-sm text-gray-400 mb-5">
          {/* Datos dinámicos: user.calificacion y user.conteoResenas */}
          <p>
            ⭐ {user.calificacion} (<span id="review-count">{user.conteoResenas}</span> reseñas)
          </p>
        </div>
        <div className="profile-actions flex justify-center gap-4">
          <button className="bg-blue-500 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-600 transition duration-300 shadow-md">
            Contactar
          </button>
          <button
            onClick={handleFollowClick}
            className={`font-bold py-2 px-6 rounded-full transition duration-300 shadow-md ${
              isFollowing
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {isFollowing ? 'Siguiendo' : 'Seguir'}
          </button>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Habilidades</h3>
        <ul className="flex flex-wrap justify-center gap-2">
          {/* Datos dinámicos: user.habilidades */}
          {user.habilidades.map((skill) => (
            <li key={skill} className="bg-blue-100 text-blue-700 font-medium text-sm rounded-full px-4 py-1">
              {skill}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Contacto</h3>
        <p className="text-sm text-gray-600 mb-1">
          {/* Datos dinámicos: user.correo */}
          <strong>Correo:</strong> {user.correo}
        </p>
        <p className="text-sm text-gray-600">
          {/* Datos dinámicos: user.telefono */}
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
                className="bg-red-500 text-white font-bold py-2 px-6 rounded-full hover:bg-red-600 transition duration-300"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default UsuarioProfileAside;
