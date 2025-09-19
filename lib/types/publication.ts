// Tipos e interfaces que describen la forma de una Publicación
// ========================
// Dominio: Publicaciones
// ========================

// --- Entidad principal ---
export interface Publication {
  idPublicacion: number;
  idUsuario: number;
  titulo: string;
  descripcion: string;
  remuneracion: number;
  tipo: PublicationType;
  estado: PublicationStatus;
  fechaPublicacion: Date;
  fechaCierre?: Date;
  idUbicacion: number;
  idCategoria: number;
}

// --- Enums ---
export enum PublicationType {
  FULLTIME = 'FULLTIME',
  PARTTIME = 'PARTTIME',
  FREELANCE = 'FREELANCE',
}

export enum PublicationStatus {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  CERRADO = 'CERRADO',
}

// ========================
// Create Publication
// ========================
export interface CreatePublicationRequest {
  idUsuario: number;
  titulo: string;
  descripcion: string;
  remuneracion: number;
  tipo: PublicationType;
  fechaCierre?: Date;
  idUbicacion: number;
  idCategoria: number;
}

export interface CreatePublicationResponse {
  success: boolean;
  data?: Publication;
  error?: string;
}

// ========================
// List Publications
// ========================
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
  idCategoria?: number;
  idUbicacion?: number;
  remuneracionMin?: number;
  remuneracionMax?: number;
  fechaDesde?: Date;
  fechaHasta?: Date;
}

export interface PublicationSort {
  field: 'fechaPublicacion' | 'remuneracion' | 'titulo';
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

// ========================
// Delete Publication
// ========================
export interface DeletePublicationRequest {
  idPublicacion: number;
  idUsuario: number; // Ownership check
}

export interface DeletePublicationResponse {
  success: boolean;
  error?: string;
}
