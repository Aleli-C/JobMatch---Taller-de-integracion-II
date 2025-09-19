'use client';

import React, { useState } from 'react';

const ProfileAside = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  return (
    <aside className="flex-1 flex flex-col gap-5">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <div className="relative w-36 h-36 rounded-full mx-auto mb-4 border-4 border-blue-500">
          <img
            id="profile-img"
            src="https://cdn-icons-png.flaticon.com/512/1361/1361728.png"
            alt="Silueta de perfil"
            className="w-full h-full rounded-full object-cover p-2 bg-gray-200"
          />
        </div>
        <h2 className="text-2xl font-bold mb-1">Juan Gutierrez</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-4">
          Soy un profesional con 5 años de experiencia en diseño gráfico y multimedia. Busco oportunidades para proyectos freelance de branding e ilustración. Ofrezco servicios de creación de logos, diseño de empaques y animaciones 2D.
        </p>
        <div className="text-sm text-gray-400 mb-5">
          <p>
            ⭐ 4.8 (<span id="review-count">5</span> reseñas)
          </p>
        </div>
        <div className="profile-actions flex justify-center gap-4">
          <button className="bg-blue-500 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-600 transition duration-300">
            Contactar
          </button>
          <button
            onClick={handleFollowClick}
            className={`font-bold py-2 px-6 rounded-full transition duration-300 ${
              isFollowing
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {isFollowing ? 'Siguiendo' : 'Seguir'}
          </button>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Habilidades</h3>
        <ul className="flex flex-wrap justify-center gap-2">
          {['Desarrollo Web', 'Diseño Gráfico', 'Marketing Digital'].map((skill) => (
            <li key={skill} className="bg-gray-200 text-gray-600 text-sm rounded-full px-4 py-1">
              {skill}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Contacto</h3>
        <p className="text-sm text-gray-600">
          <strong>Correo:</strong> jgutierrez@gmail.com
        </p>
        <p className="text-sm text-gray-600">
          <strong>Teléfono:</strong> +56 9 2874 1287
        </p>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-sm text-center">
            <p className="text-lg font-semibold mb-4">¿Dejar de seguir?</p>
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

export default ProfileAside;