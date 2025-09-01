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

// ESTOs TIPOS PARA ListPublication

export interface ListPublicationsParams {
  page?: number;
  limit?: number;
  filters?: PublicationFilters;
  sort?: PublicationSort;
}

export interface PublicationFilters {
  titulo?: string;
  tipo?: PublicationType;
  estado?: PublicationStatus;
  id_categoria?: number;
  id_ubicacion?: number;
  remuneracion_min?: number;
  remuneracion_max?: number;
  fecha_desde?: Date;
  fecha_hasta?: Date;
}

export interface PublicationSort {
  field: 'fecha_publicacion' | 'remuneracion' | 'titulo';
  order: 'asc' | 'desc';
}

export interface ListPublicationsResult {
  success: boolean;
  publications?: Publication[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  error?: string;
}