// Lógica compartida - Interface para acceso a datos
import { Publication, CreatePublicationRequest, ListPublicationsParams, DeletePublicationRequest } from '../types/publication';

export interface PublicationRepository {
  create(data: CreatePublicationRequest): Promise<Publication>;
  validateRelatedEntities(idUbicacion: number, idCategoria: number): Promise<boolean>;
  delete(data: DeletePublicationRequest): Promise<boolean>;
    
  // Método para listar publicaciones:
  list(params: ListPublicationsParams): Promise<{
    publications: Publication[];
    total: number;
  }>;
}
