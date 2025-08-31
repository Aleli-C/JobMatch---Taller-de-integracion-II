// Lógica compartida - Interface para acceso a datos
import { Publication, CreatePublicationRequest } from '../types/publication';

export interface PublicationRepository {
  create(data: CreatePublicationRequest): Promise<Publication>;
  validateRelatedEntities(ubicacionId: number, categoriaId: number): Promise<boolean>;
}
