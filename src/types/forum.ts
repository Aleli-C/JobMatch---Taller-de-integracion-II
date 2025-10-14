export type ForumDetail = {
  id_foro: number;
  titulo: string;
  consulta: string;
  fecha: string; 
  nombres: string;
  apellidos: string;
  rol: "admin" | "empleador" | "trabajador";
  total_respuestas: number;
};
