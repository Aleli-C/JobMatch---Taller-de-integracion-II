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
        estado: PublicationStatus.ACTIVA,
        fecha_publicacion: new Date()
      }
    });

    return publication as Publication;
  }

  async validateRelatedEntities(ubicacionId: number, categoriaId: number): Promise<boolean> {
    const [ubicacion, categoria] = await Promise.all([
      this.prisma.ubicacion.findUnique({ where: { id_ubicacion: ubicacionId } }),
      this.prisma.categoria.findUnique({ where: { id_categoria: categoriaId } })
    ]);

    return !!(ubicacion && categoria);
  }
}