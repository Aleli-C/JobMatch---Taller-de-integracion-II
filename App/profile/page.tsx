// app/profile/page.tsx

'use client';

import React from 'react';
// Importamos el componente contenedor del layout
import OwnProfile from '../../components/OwnProfile'; 
// Importamos el nuevo Proveedor de Contexto (que tiene toda la lógica de carga y useUser)
import { UserProvider } from '../../components/UserProvider'; 


/**
 * Componente Page principal para la ruta /profile.
 * Su única responsabilidad es envolver la vista principal con el UserProvider.
 */
export default function ProfilePage() {

  return (
    // 1. Envolvemos toda la página en el UserProvider.
    // Toda la lógica de useState, useEffect, loading y error ocurre DENTRO de UserProvider.
    <UserProvider>
      <main className="max-w-7xl mx-auto p-4 lg:p-8 bg-gray-100 min-h-screen">
        {/* Renderizamos el componente que consume los datos del contexto */}
        <OwnProfile />
      </main>
    </UserProvider>
  );
}
