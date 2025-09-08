// Lógica compartida - Lógica de negocio para publicaciones
import { z } from 'zod';
import { PublicationRepository } from '../repositories/publication-repository';
import { 
  createPublicationSchema, 
  listPublicationsSchema, 
  deletePublicationSchema 
} from '../zod/publications';
import { 
  CreatePublicationRequest, 
  CreatePublicationResponse, 
  ListPublicationsParams, 
  ListPublicationsResult,
  DeletePublicationRequest,
  DeletePublicationResponse 
} from '../types/publication';
import { buildPagination } from '../utils/pagination';

export class PublicationService {
  constructor(private repository: PublicationRepository) {}

  // --- PUBLIC METHODS ---
  async createPublication(request: CreatePublicationRequest): Promise<CreatePublicationResponse> {
    return this.safeExecute(async () => {
      const validatedData = createPublicationSchema.parse(request);

      await this.ensureValidEntities(validatedData.idUbicacion, validatedData.idCategoria);

      const publication = await this.repository.create(validatedData);
      return { success: true, data: publication };
    });
  }

  async listPublications(params: ListPublicationsParams = {}): Promise<ListPublicationsResult> {
    return this.safeExecute(async () => {
      const validatedParams = listPublicationsSchema.parse(params);
      const result = await this.repository.list(validatedParams);

      const pagination = buildPagination(
        result.total,
        validatedParams.page,
        validatedParams.limit
      );

      return { success: true, publications: result.publications, pagination };
    });
  }

  async deletePublication(request: DeletePublicationRequest): Promise<DeletePublicationResponse> {
    return this.safeExecute(async () => {
      const validatedData = deletePublicationSchema.parse(request);

      const deleted = await this.repository.delete(validatedData);
      if (!deleted) {
        return { success: false, error: 'No autorizado o publicación no encontrada' };
      }

      return { success: true };
    });
  }

  // --- PRIVATE HELPERS ---
  private async ensureValidEntities(idUbicacion: number, idCategoria: number): Promise<void> {
    const valid = await this.repository.validateRelatedEntities(idUbicacion, idCategoria);
    if (!valid) {
      throw new Error('Ubicación o categoría no válidas');
    }
  }

  private async safeExecute<T>(fn: () => Promise<T>): Promise<T | { success: false; error: string }> {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, error: error.errors.map(e => e.message).join(', ') } as any;
      }
      return { success: false, error: error instanceof Error ? error.message : 'Error interno del servidor' } as any;
    }
  }
}
