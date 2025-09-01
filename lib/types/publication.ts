// Tipos e interfaces que describen la forma de una Publicación
export interface Publication {
  id_publicacion?: number;
  id_usuario: number;
  titulo: string;
  descripcion: string;
  remuneracion: number;
  tipo: PublicationType;
  estado: PublicationStatus;
  fecha_publicacion: Date;
  fecha_cierre: Date;
  id_ubicacion: number;
  id_categoria: number;
}

export enum PublicationType {
  TIEMPO_COMPLETO = 'tiempo_completo',
  MEDIO_TIEMPO = 'medio_tiempo',
  FREELANCE = 'freelance',
  PRACTICAS = 'practicas',
  PROYECTO = 'proyecto'
}

export enum PublicationStatus {
  ACTIVA = 'activa',
  PAUSADA = 'pausada',
  CERRADA = 'cerrada',
  VENCIDA = 'vencida'
}

export interface CreatePublicationRequest {
  id_usuario: number;
  titulo: string;
  descripcion: string;
  remuneracion: number;
  tipo: PublicationType;
  fecha_cierre: Date;
  id_ubicacion: number;
  id_categoria: number;
}

export interface CreatePublicationResponse {
  success: boolean;
  data?: Publication;
  error?: string;
}