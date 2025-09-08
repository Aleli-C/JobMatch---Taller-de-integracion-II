// Implementación con Prisma (para cuando tengamos la BD configurada)
import { PrismaClient } from '@prisma/client';
import { PublicationRepository } from './publication-repository';
import { Publication, CreatePublicationRequest, PublicationStatus } from '../types/publication';

export class PrismaPublicationRepository implements PublicationRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreatePublicationRequest): Promise<Publication> {
    const publication = await this.prisma.publicacion.create({
      data: {
        ...data,
        estado: PublicationStatus.ACTIVO,
        fechaPublicacion: new Date()
      }
    });

    return publication as Publication;
  }

  async validateRelatedEntities(ubicacionId: number, categoriaId: number): Promise<boolean> {
    const [ubicacion, categoria] = await Promise.all([
      this.prisma.ubicacion.findUnique({ where: { idUbicacion: ubicacionId } }),
      this.prisma.categoria.findUnique({ where: { idCategoria: categoriaId } })
    ]);

    return !!(ubicacion && categoria);
  }
}
