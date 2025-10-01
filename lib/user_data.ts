// user_data.ts

/**
 * Define la estructura de datos para un perfil de usuario.
 * NOTA: Esta interfaz debe coincidir con la estructura de tu base de datos real.
 */
export interface User {
  id: string;
  nombre: string;
  descripcion: string;
  imagenUrl: string;
  calificacion: number;
  conteoResenas: number;
  habilidades: string[];
  correo: string;
  telefono: string;
}

// Datos simulados para Juan Gutierrez
const mockUser: User = {
  id: 'user-123',
  nombre: 'Juan Gutierrez',
  descripcion:
    'Soy un profesional con 5 años de experiencia en diseño gráfico y multimedia. Busco oportunidades para proyectos freelance de branding e ilustración. Ofrezco servicios de creación de logos, diseño de empaques y animaciones 2D.',
  imagenUrl:
    'https://cdn-icons-png.flaticon.com/512/1361/1361728.png',
  calificacion: 4.8,
  conteoResenas: 5,
  habilidades: ['Desarrollo Web', 'Diseño Gráfico', 'Marketing Digital', 'Ilustración'],
  correo: 'jgutierrez@gmail.com',
  telefono: '+56 9 2874 1287',
};

/**
 * Función asíncrona simulada para obtener los datos de un usuario.
 * @param userId - El ID del usuario a buscar (actualmente ignorado en el mock).
 * @returns Una promesa que resuelve con los datos del usuario.
 */
export const getUser = async (userId: string): Promise<User> => {
  // Simular un retraso de red de 500ms
  await new Promise(resolve => setTimeout(resolve, 500)); 

  // En un entorno real, aquí harías una llamada a la API o a Firestore.
  // const userDoc = await getDoc(doc(db, "users", userId));
  
  return mockUser; 
};
