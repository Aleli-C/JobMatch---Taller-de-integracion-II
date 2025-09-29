// UserProvider.tsx

'use client';

import React, { 
    useState, 
    useEffect, 
    createContext, 
    useContext, 
    ReactNode 
} from 'react';

// Importamos los tipos y la función de servicio.
// NOTA CRÍTICA: La ruta asume que el archivo de servicio user_data.ts está en ../lib/
import { getUser, User } from '../lib/user_data'; 

// 1. Definición del Contrato del Contexto
interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// 2. Hook personalizado para consumir el contexto fácilmente
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    // Es vital que este error sea claro si se usa fuera del Provider
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// 3. Definición del Proveedor (Provider)
interface UserProviderProps {
  children: ReactNode;
}

/**
 * Componente que se encarga de cargar los datos del usuario (getUser) 
 * y proveerlos a toda la jerarquía de componentes a través del Contexto.
 * Incluye manejo de loading y errores para cumplir con la operatividad requerida.
 */
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ID simulado. En producción, esto vendría de la sesión o la URL.
    const userId = 'current-user-id'; 

    const fetchUser = async () => {
      try {
        setLoading(true);
        // Llamada a la función de servicio que simula la API
        const userData = await getUser(userId);
        setUser(userData);
        setError(null);
      } catch (err) {
        console.error("Error loading user data:", err);
        setError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); 

  const contextValue: UserContextType = { user, loading, error };

  // Manejo visual de los estados de carga (crucial para la estabilidad en tests)
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-8">
        <div className="flex items-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-xl text-gray-700 font-semibold">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  // Manejo visual del estado de error
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-8">
        <div className="text-center p-6 bg-red-50 border border-red-300 rounded-lg shadow-lg max-w-sm">
            <p className="text-xl text-red-600 font-bold mb-2">Error de Carga</p>
            <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }
  
  // Proporciona el contexto a los hijos
  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};