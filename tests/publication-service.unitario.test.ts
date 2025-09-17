// tests/publication-service.unitario.test.ts

import { PublicationService } from '../lib/servicies/publication-service';
import { PublicationRepository } from '../lib/repositories/publication-repository';
import { describe, it, expect, beforeEach } from 'vitest';
import { mock, mockReset } from 'vitest-mock-extended';
import { PublicationType, PublicationStatus } from '../lib/types/publication';

// 1. Creamos un mock del repositorio.
const mockRepo = mock<PublicationRepository>();

// 2. Antes de cada test, reseteamos el mock.
beforeEach(() => {
  mockReset(mockRepo);
});

describe('PublicationService', () => {
  // 3. Instanciamos el servicio CON el repositorio MOCKEADO.
  // Ahora 'service' es visible para todos los tests anidados.
  const service = new PublicationService(mockRepo);

  // =================================================================
  // Tests para el método createPublication
  // =================================================================
  describe('createPublication', () => {
    it('✅ debería crear una publicación si los datos son válidos y las entidades existen', async () => {
      // 1. Arrange (Preparar)
      const request = {
        idUsuario: 1,
        titulo: 'Desarrollador Backend con Node.js',
        descripcion: 'Se necesita un desarrollador con experiencia en NestJS y Prisma para un proyecto increíble.',
        remuneracion: 50000,
        tipo: PublicationType.FULLTIME,
        fechaCierre: new Date('2026-01-01'),
        idUbicacion: 10,
        idCategoria: 5,
      };
      
      const expectedPublication = { idPublicacion: 123, ...request, estado: PublicationStatus.ACTIVO, fechaPublicacion: new Date() };

      mockRepo.validateRelatedEntities.mockResolvedValue(true);
      mockRepo.create.mockResolvedValue(expectedPublication);

      // 2. Act (Actuar)
      const result = await service.createPublication(request);

      // 3. Assert (Afirmar)
      expect(mockRepo.validateRelatedEntities).toHaveBeenCalledWith(10, 5);
      expect(mockRepo.create).toHaveBeenCalledWith(request);
      expect(result).toEqual({ success: true, data: expectedPublication });
    });

    it('❌ debería devolver un error si la ubicación o categoría no son válidas', async () => {
      // 1. Arrange
      // DATO CORREGIDO: Usamos datos válidos porque lo que probamos es la respuesta del mock.
      const request = {
        idUsuario: 1,
        titulo: 'Desarrollador Backend con Node.js',
        descripcion: 'Se necesita un desarrollador con experiencia en NestJS y Prisma para un proyecto increíble.',
        remuneracion: 50000,
        tipo: PublicationType.FULLTIME,
        fechaCierre: new Date('2026-01-01'),
        idUbicacion: 10,
        idCategoria: 5,
      };
      
      mockRepo.validateRelatedEntities.mockResolvedValue(false);

      // 2. Act
      const result = await service.createPublication(request as any);

      // 3. Assert
      expect(mockRepo.create).not.toHaveBeenCalled();
      expect(result).toEqual({ success: false, error: 'Ubicación o categoría no válidas' });
    });
    
    it('❌ debería devolver un error de Zod si el título es muy corto', async () => {
      // 1. Arrange
      const invalidRequest = {
        idUsuario: 1,
        titulo: 'Ops', // Título inválido
        descripcion: 'Esta descripción es perfectamente válida y cumple los requisitos.',
        remuneracion: 50000,
        tipo: PublicationType.FULLTIME,
        fechaCierre: new Date('2026-01-01'),
        idUbicacion: 10,
        idCategoria: 5,
      };

      // 2. Act
      const result = await service.createPublication(invalidRequest);
      
      // 3. Assert
      expect(result.success).toBe(false);
      expect(result.error).toContain('El título debe tener al menos 5 caracteres');
      expect(mockRepo.create).not.toHaveBeenCalled();
    });
  });

  // =================================================================
  // Tests para el método listPublications
  // =================================================================
  describe('listPublications', () => {
    it('✅ debería llamar al repositorio con los parámetros por defecto si no se proveen', async () => {
      // 1. Arrange
      mockRepo.list.mockResolvedValue({ publications: [], total: 0 });

      // 2. Act
      await service.listPublications();

      // 3. Assert
      expect(mockRepo.list).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        sort: { field: 'fechaPublicacion', order: 'desc' },
      });
    });

    it('✅ debería pasar los filtros, paginación y ordenamiento al repositorio', async () => {
      // 1. Arrange
      const params = {
        page: 2,
        limit: 20,
        filters: {
          titulo: 'React',
          tipo: PublicationType.PARTTIME,
        },
        sort: {
          field: 'remuneracion',
          order: 'asc',
        },
      };
      mockRepo.list.mockResolvedValue({ publications: [], total: 0 });

      // 2. Act
      await service.listPublications(params as any);

      // 3. Assert
      expect(mockRepo.list).toHaveBeenCalledWith(params);
    });
    
    it('❌ debería devolver un error de Zod si la página es inválida', async () => {
      // 1. Arrange
      const invalidParams = { page: 0 };
      
      // 2. Act
      const result = await service.listPublications(invalidParams);

      // 3. Assert
      expect(result.success).toBe(false);
      expect(result.error).toContain('La página debe ser mayor a 0');
    });
  });

  // =================================================================
  // Tests para el método deletePublication
  // =================================================================
  describe('deletePublication', () => {
    it('✅ debería devolver éxito si el repositorio elimina la publicación', async () => {
      // 1. Arrange
      const request = { idPublicacion: 1, idUsuario: 1 };
      mockRepo.delete.mockResolvedValue(true);

      // 2. Act
      const result = await service.deletePublication(request);

      // 3. Assert
      expect(mockRepo.delete).toHaveBeenCalledWith(request);
      expect(result).toEqual({ success: true });
    });

    it('❌ debería devolver un error si el repositorio no encuentra la publicación o el usuario no está autorizado', async () => {
      // 1. Arrange
      const request = { idPublicacion: 999, idUsuario: 1 };
      mockRepo.delete.mockResolvedValue(false);

      // 2. Act
      const result = await service.deletePublication(request);
      
      // 3. Assert
      expect(mockRepo.delete).toHaveBeenCalledWith(request);
      expect(result).toEqual({ success: false, error: 'No autorizado o publicación no encontrada' });
    });
  });

});