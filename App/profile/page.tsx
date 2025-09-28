'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
// Importamos el nuevo componente contenedor usando ruta relativa
import OwnProfile from '../../components/OwnProfile'; 
// Importamos la lógica de servicio y el tipo User usando ruta relativa
import { getUser, User } from '../../lib/user_data'; 


// 1. Definición del contexto para el usuario
interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Hook personalizado para usar el contexto fácilmente
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    // Es vital que este error sea claro si se usa fuera del Provider
    throw new Error('useUser debe usarse dentro de un UserProvider');
  }
  return context;
};

/**
 * Componente Page principal para la ruta /profile.
 * Se encarga de cargar los datos iniciales del usuario y proveerlos
 * a través del contexto a toda la vista.
 */
export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulamos la obtención del ID de la URL o sesión
    const userId = 'current-user-id'; 

    const fetchUser = async () => {
      try {
        setLoading(true);
        // Función simulada para obtener los datos del usuario
        const userData = await getUser(userId);
        setUser(userData);
        setError(null);
      } catch (err) {
        console.error("Error al cargar el usuario:", err);
        setError("Error al cargar el perfil. Inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const contextValue: UserContextType = { user, loading, error };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-8">
        <p className="text-xl text-blue-500 font-semibold">Cargando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-8">
        <p className="text-xl text-red-600 font-semibold">{error}</p>
      </div>
    );
  }
  
  // 2. Proporcionar el contexto a los hijos
  return (
    <UserContext.Provider value={contextValue}>
      <main className="max-w-7xl mx-auto p-4 lg:p-8 bg-gray-100 min-h-screen">
        {/* Renderizamos el nuevo componente contenedor que usará el contexto */}
        <OwnProfile />
      </main>
    </UserContext.Provider>
  );
}
