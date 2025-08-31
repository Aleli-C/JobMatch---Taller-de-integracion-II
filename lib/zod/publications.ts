// Esquemas de validación Zod para el dominio de publicaciones
import { z } from 'zod';
import { PublicationType } from '../types/publication';

export const createPublicationSchema = z.object({
  id_usuario: z.number().int().positive('ID de usuario debe ser positivo'),
  titulo: z.string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(100, 'El título no puede exceder 100 caracteres')
    .trim(),
  descripcion: z.string()
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .max(2000, 'La descripción no puede exceder 2000 caracteres')
    .trim(),
  remuneracion: z.number()
    .min(0, 'La remuneración no puede ser negativa')
    .max(99999999.99, 'Remuneración excede el límite máximo'),
  tipo: z.nativeEnum(PublicationType, {
    errorMap: () => ({ message: 'Tipo de trabajo no válido' })
  }),
  fecha_cierre: z.date()
    .refine(date => date > new Date(), {
      message: 'La fecha de cierre debe ser posterior a la fecha actual'
    }),
  id_ubicacion: z.number().int().positive('ID de ubicación debe ser positivo'),
  id_categoria: z.number().int().positive('ID de categoría debe ser positivo')
});