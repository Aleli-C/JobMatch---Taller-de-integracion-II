import { describe, it, expect } from 'vitest';
// Asegúrate de que la ruta de importación sea correcta desde tu archivo de test
import { listPublicationsSchema } from '../lib/zod/publications';
import { PublicationType } from '../lib/types/publication';

// Agrupamos los tests para el esquema de listar publicaciones
describe('Validador de Listado de Publicaciones (listPublicationsSchema)', () => {

  // --- 1. Pruebas de Valores por Defecto ---
  describe('Valores por Defecto', () => {
    it('debería aplicar los valores por defecto cuando no se proveen datos', () => {
      const input = {};
      const result = listPublicationsSchema.parse(input);

      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.sort).toEqual({ field: 'fechaPublicacion', order: 'desc' });
      expect(result.filters).toBeUndefined();
    });
  });

  // --- 2. Pruebas de Caminos Felices (Happy Paths) ---
  describe('Datos Válidos', () => {
    it('debería validar correctamente un input completo y válido', () => {
      const validInput = {
        page: 2,
        limit: 20,
        sort: { field: 'remuneracion', order: 'asc' },
        filters: {
          titulo: 'Desarrollador',
          tipo: PublicationType.FULLTIME,
          remuneracionMin: 50000,
          remuneracionMax: 100000,
          idCategoria: 1,
        }
      };

      // No debería lanzar ningún error
      expect(() => listPublicationsSchema.parse(validInput)).not.toThrow();
    });
  });

  // --- 3. Pruebas de Caminos Tristes (Sad Paths) y Casos Borde ---
  describe('Datos Inválidos', () => {
    it('debería fallar si page es menor a 1', () => {
      const invalidInput = { page: 0 };
      expect(() => listPublicationsSchema.parse(invalidInput)).toThrow('La página debe ser mayor a 0');
    });

    it('debería fallar si limit es mayor a 100', () => {
      const invalidInput = { limit: 101 };
      expect(() => listPublicationsSchema.parse(invalidInput)).toThrow('El límite no puede exceder 100');
    });

    it('debería fallar si el campo de ordenamiento no es válido', () => {
      const invalidInput = { sort: { field: 'campoInvalido', order: 'desc' } };
      expect(() => listPublicationsSchema.parse(invalidInput)).toThrow('Campo de ordenamiento no válido');
    });

    it('debería fallar si un ID en los filtros es negativo', () => {
      const invalidInput = { filters: { idCategoria: -5 } };
      expect(() => listPublicationsSchema.parse(invalidInput)).toThrow('ID de categoría debe ser positivo');
    });
  });

  // --- 4. Pruebas Específicas para las Reglas .refine() ---
  describe('Reglas de Refinamiento (.refine)', () => {
    it('debería fallar si remuneracionMin es mayor que remuneracionMax', () => {
      const invalidInput = {
        filters: {
          remuneracionMin: 1000,
          remuneracionMax: 500
        }
      };
      expect(() => listPublicationsSchema.parse(invalidInput)).toThrow('La remuneración mínima no puede ser mayor que la máxima');
    });

    it('debería validar correctamente si remuneracionMin es igual a remuneracionMax', () => {
      const validInput = {
        filters: {
          remuneracionMin: 1000,
          remuneracionMax: 1000
        }
      };
      expect(() => listPublicationsSchema.parse(validInput)).not.toThrow();
    });
    
    it('debería fallar si fechaDesde es posterior a fechaHasta', () => {
        const invalidInput = {
            filters: {
                fechaDesde: new Date('2025-10-10'),
                fechaHasta: new Date('2025-10-09')
            }
        };
        expect(() => listPublicationsSchema.parse(invalidInput)).toThrow('La fecha desde no puede ser posterior a la fecha hasta');
    });
  });
});