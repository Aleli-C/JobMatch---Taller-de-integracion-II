// Implementación con Prisma (para cuando tengamos la BD configurada)
import { PrismaClient } from '@prisma/client';
import { PublicationRepository } from './publication-repository';
import { 
  Publication, 
  CreatePublicationRequest, 
  PublicationStatus, 
  DeletePublicationRequest 
} from '../types/publication';

export class PrismaPublicationRepository implements PublicationRepository {
  constructor(private prisma: PrismaClient) {}

  // Crear publicación
  async create(data: CreatePublicationRequest): Promise<Publication> {
    const publication = await this.prisma.publicacion.create({
      data: {
        ...data,
        estado: PublicationStatus.ACTIVO,
        fechaPublicacion: new Date(),
      },
    });

    return publication as Publication;
  }

  // Validar que Ubicación y Categoría existan
  async validateRelatedEntities(
    idUbicacion: number, 
    idCategoria: number
  ): Promise<boolean> {
    const [ubicacion, categoria] = await Promise.all([
      this.prisma.ubicacion.findUnique({ where: { idUbicacion } }),
      this.prisma.categoria.findUnique({ where: { idCategoria } }),
    ]);

    return !!(ubicacion && categoria);
  }

  // Eliminar publicación con ownership
  async delete(request: DeletePublicationRequest): Promise<boolean> {
    const publication = await this.prisma.publicacion.findUnique({
      where: { idPublicacion: request.idPublicacion },
    });

    // Si no existe o el ownership no coincide, devolvemos false
    if (!publication || publication.idUsuario !== request.idUsuario) {
      return false;
    }

    await this.prisma.publicacion.delete({
      where: { idPublicacion: request.idPublicacion },
    });

    return true;
  }
}
