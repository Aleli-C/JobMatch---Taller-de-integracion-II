// src/types/publication.ts
export type Publication = {
  id_publicacion: number;
  id_usuario: number;
  titulo: string;
  descripcion: string;
  direccion?: string | null;
  horario?: string | null;
  tipo?: string | null;
  monto?: number | string | null;
  horas?: string | null;
  estado: 'activa' | 'pausada' | 'cerrada' | 'eliminada';
  ciudad?: string | null;
  region?: string | null;
  created_at?: string | null;
  fecha_actualizacion?: string | null;
};
