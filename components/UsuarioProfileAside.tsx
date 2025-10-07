// components/UsuarioProfileAside.tsx
'use client';

import React from 'react';
import { useUser } from './UserProvider';

const UsuarioProfileAside = () => {
  const { user } = useUser();
  if (!user) return null;

  const u = user as any;
  const habilidades: string[] = Array.isArray(u?.habilidades) ? u.habilidades : [];

  return (
    <aside className="flex-1 flex flex-col gap-5 min-w-80">
      <div className="bg-white p-6 rounded-xl shadow-lg text-center">
        <div className="relative w-36 h-36 rounded-full mx-auto mb-4 border-4 border-blue-500">
          <img
            id="profile-img"
            src={u?.imagenUrl ?? ''}
            alt={`Foto de perfil de ${user.nombre}`}
            className="w-full h-full rounded-full object-cover p-2 bg-gray-200"
          />
        </div>
        <h2 className="text-2xl font-bold mb-1">{user.nombre}</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-4">{u?.descripcion ?? ''}</p>
        <div className="text-sm text-gray-400">
          <p>⭐ {(u?.calificacion ?? 0).toFixed(1)} (<span id="review-count">{u?.conteoResenas ?? 0}</span> reseñas)</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Habilidades</h3>
        <ul className="flex flex-wrap justify-center gap-2">
          {habilidades.map((skill) => (
            <li key={skill} className="bg-blue-100 text-blue-700 font-medium text-sm rounded-full px-4 py-1">
              {skill}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Contacto</h3>
        <p className="text-sm text-gray-600 mb-1">
          <strong>Correo:</strong> {user.correo}
        </p>
        <p className="text-sm text-gray-600">
          <strong>region:</strong> {u?.region ?? ''}
        </p>
      </div>
    </aside>
  );
};

export default UsuarioProfileAside;
