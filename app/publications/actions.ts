// Server Actions para manejar publicaciones sin necesidad de exponer una API REST.
// Estas funciones corren en el servidor y permiten interactuar con los servicios directamente.

"use server";

import { revalidatePath } from 'next/cache';
import { createPublicationService } from '../../lib/config';
import { CreatePublicationRequest } from '../../lib/types/publication';

// Crea una nueva publicación a partir de datos enviados desde un formulario.
// Usa PublicationService y revalida la ruta para mostrar la nueva publicación en la UI.
export async function createPublication(formData: FormData) {
  const service = createPublicationService();

  const request: CreatePublicationRequest = {
    id_usuario: parseInt(formData.get('id_usuario') as string),
    titulo: formData.get('titulo') as string,
    descripcion: formData.get('descripcion') as string,
    remuneracion: parseFloat(formData.get('remuneracion') as string),
    tipo: formData.get('tipo') as any,
    fecha_cierre: new Date(formData.get('fecha_cierre') as string),
    id_ubicacion: parseInt(formData.get('id_ubicacion') as string),
    id_categoria: parseInt(formData.get('id_categoria') as string),
  };

  const result = await service.createPublication(request);

  if (result.success) {
    // Invalida y refresca la caché de la página de publicaciones
    revalidatePath('/publications');
  }

  return result;
}
