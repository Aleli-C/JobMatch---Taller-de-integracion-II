//lib/servicies/publication-service.ts (Versión Corregida)

import { z } from 'zod';
import { PublicationRepository } from '../repositories/publication-repository';
import {
  createPublicationSchema,
  listPublicationsSchema,
  deletePublicationSchema
} from "../zod/publications";
import {
  CreatePublicationRequest,
  CreatePublicationResponse,
  ListPublicationsParams,
  ListPublicationsResult,
  DeletePublicationRequest,
  DeletePublicationResponse,
} from '../types/publication';
import { buildPagination } from "../utils/pagination";

// Ya NO necesitamos los mappers ni los enums de Prisma aquí.

export class PublicationService {
  constructor(private repository: PublicationRepository) {}

  // Crear publicación
  public async createPublication(
    request: CreatePublicationRequest
  ): Promise<CreatePublicationResponse> {
    return this.safeExecute(async () => {
      const validatedData = createPublicationSchema.parse(request);
      await this.ensureValidEntities(validatedData.idUbicacion, validatedData.idCategoria);

      // El repositorio recibe los datos del dominio directamente.
      // Ya no se hace la conversión a enums de Prisma aquí.
      const publication = await this.repository.create(validatedData);

      return { success: true, data: publication };
    });
  }

  // Listar publicaciones (CORREGIDO)
  public async listPublications(
    params: ListPublicationsParams = {}
  ): Promise<ListPublicationsResult> {
    return this.safeExecute(async () => {
      const validatedParams = listPublicationsSchema.parse(params);

      // Pasamos los parámetros validados directamente al repositorio.
      // El repositorio se encarga de construir la cláusula 'where'
      // y de mapear los enums si es necesario.
      const result = await this.repository.list(validatedParams);

      const pagination = buildPagination(
        result.total,
        validatedParams.page,
        validatedParams.limit
      );

      return { success: true, publications: result.publications, pagination };
    });
  }

  // Eliminar publicación (sin cambios)
  public async deletePublication(
    request: DeletePublicationRequest
  ): Promise<DeletePublicationResponse> {
    return this.safeExecute(async () => {
      const validatedData = deletePublicationSchema.parse(request);
      // Solo el propietario puede eliminar su publicación
      const deleted = await this.repository.delete(validatedData);
      if (!deleted) {
        //Mensaje de retroalimentación para el usuario
        return { success: false, error: 'No autorizado o publicación no encontrada' };
      }
      return { success: true };
    });
  }

  // --- HELPERS (sin cambios) ---
  private async ensureValidEntities(idUbicacion: number, idCategoria: number): Promise<void> {
    const valid = await this.repository.validateRelatedEntities(idUbicacion, idCategoria);
    if (!valid) {
      throw new Error('Ubicación o categoría no válidas');
    }
  }

  private async safeExecute<T>(
    fn: () => Promise<T>
  ): Promise<T | { success: false; error: string }> {
    try {
      return await fn();
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: unknown): { success: false; error: string } {
    const handlers: ((err: unknown) => string | null)[] = [
      (err) =>
        err instanceof z.ZodError
          ? err.issues.map((e) => e.message).join(', ')
          : null,
      (err) => (err instanceof Error ? err.message : null),
    ];

    for (const handler of handlers) {
      const msg = handler(error);
      if (msg) return { success: false, error: msg };
    }
    return { success: false, error: 'Error interno del servidor' };
  }
}