// Tipos estrictos basados en la BD real
export type ForoBase = {
  id_foro: number;
  id_usuario: number;
  titulo: string;
  consulta: string;
  fecha: string; // ISO DATETIME(3)
};

// Si el backend hace JOIN con Usuarios y COUNT de Respuestas_foros:
export type ForoAutor = {
  id_usuario: number;
  nombres?: string;
  apellidos?: string;
  rol?: "admin" | "empleador" | "trabajador";
};

export type ForumDetail = ForoBase & {
  autor?: ForoAutor;          // opcional: solo si el backend lo entrega
  total_respuestas?: number;  // opcional: COUNT(respuestas) si existe
};
