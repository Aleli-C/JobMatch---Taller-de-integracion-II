// Lógica compartida - Interface para acceso a datos
import { Publication, CreatePublicationRequest, ListPublicationsParams } from '../types/publication';

export interface PublicationRepository {
  create(data: CreatePublicationRequest): Promise<Publication>;
  validateRelatedEntities(ubicacionId: number, categoriaId: number): Promise<boolean>;
  
  // Método para ListPublication:
  list(params: ListPublicationsParams): Promise<{
    publications: Publication[];
    total: number;
  }>;
}