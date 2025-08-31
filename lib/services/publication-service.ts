// Lógica compartida - Lógica de negocio para publicaciones
import { PublicationRepository } from '../repositories/publication-repository';
import { createPublicationSchema } from '../zod/publications';
import { CreatePublicationRequest, CreatePublicationResponse } from '../types/publication';

export class PublicationService {
  constructor(private repository: PublicationRepository) {}

  async createPublication(request: CreatePublicationRequest): Promise<CreatePublicationResponse> {
    try {
      // 1. Validar datos de entrada
      const validatedData = createPublicationSchema.parse(request);

      // 2. Validar que las entidades relacionadas existan
      const entitiesValid = await this.repository.validateRelatedEntities(
        validatedData.id_ubicacion,
        validatedData.id_categoria
      );

      if (!entitiesValid) {
        return {
          success: false,
          error: 'Ubicación o categoría no válidas'
        };
      }

      // 3. Crear la publicación
      const publication = await this.repository.create(validatedData);

      return {
        success: true,
        data: publication
      };

    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: error.errors.map(e => e.message).join(', ')
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      };
    }
  }
}
