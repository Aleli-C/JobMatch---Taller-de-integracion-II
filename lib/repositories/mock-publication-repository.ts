// Implementación mock para desarrollo sin BD (lógica compartida) Es por el momento como no tenemos BD
import { PublicationRepository } from './publication-repository';
import { Publication, CreatePublicationRequest, PublicationStatus } from '../types/publication';

export class MockPublicationRepository implements PublicationRepository {
  private publications: Publication[] = [];
  private nextId = 1;

  async create(data: CreatePublicationRequest): Promise<Publication> {
    const publication: Publication = {
      id_publicacion: this.nextId++,
      ...data,
      estado: PublicationStatus.ACTIVA,
      fecha_publicacion: new Date()
    };

    this.publications.push(publication);
    return publication;
  }

  async validateRelatedEntities(ubicacionId: number, categoriaId: number): Promise<boolean> {
    // Mock: simular validación de entidades relacionadas
    // En producción, esto verificaría que ubicacion y categoria existen
    return ubicacionId > 0 && categoriaId > 0;
  }
}