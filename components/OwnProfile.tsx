// components/OwnProfile.tsx

'use client';

import React from 'react';
// Importamos los dos componentes hijos. La ruta se ajusta sin la extensión para la compilación.
import ProfileSidebar from './ProfileSidebar';
import UsuarioProfileAside from './UsuarioProfileAside'; 
import UsuarioProfileTabs from './UsuarioProfileTabs'; 
// ELIMINAMOS la importación innecesaria de UserProvider y MockUser desde '../app/profile/page'


/**
 * Componente contenedor principal para la vista de perfil de usuario.
 * Ensambla la barra lateral (Aside) y el contenido principal con pestañas (Tabs).
 * * NOTA: Este componente ASUME que ya está envuelto por el UserProvider 
 * en 'app/profile/page.tsx' (el componente padre).
 */
export default function OwnProfile() {
    return (
        // ELIMINAMOS el envoltorio de <UserProvider> aquí.
        // Ahora solo se enfoca en el layout.
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto py-6">
            
            {/* Título de la sección principal */}
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 sm:mb-8">
                Mi Perfil Profesional
            </h2>

            {/* Contenedor principal con diseño adaptable (side-by-side en lg) */}
            <div className="flex flex-col lg:flex-row gap-6">
                
                    {/* Profile Sidebar (expand on hover) - positioned to the left on large screens */}
                    <ProfileSidebar />

                    {/* 1. Barra Lateral */}
                    <div className="lg:w-96 flex-shrink-0">
                        <UsuarioProfileAside />
                    </div>

                    {/* 2. Área de Pestañas (Contenido Principal) */}
                    <div className="flex-1 min-w-0">
                        <UsuarioProfileTabs />
                    </div>
            </div>
        </div>
    </div>
  );
}
