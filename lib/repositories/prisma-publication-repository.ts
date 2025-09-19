import { PrismaClient, TipoEnum, EstadoEnum } from '@prisma/client';
import { PublicationRepository } from './publication-repository';
import { 
  Publication, 
  CreatePublicationRequest, 
  DeletePublicationRequest, 
  PublicationType, 
  PublicationStatus 
} from '../types/publication';

// 🔹 Helpers para mapear enums
function mapTypeToPrisma(type: PublicationType): TipoEnum {
  switch (type) {
    case PublicationType.FULLTIME: return TipoEnum.FULLTIME;
    case PublicationType.PARTTIME: return TipoEnum.PARTTIME;
  }
}

function mapStatusToPrisma(status: PublicationStatus): EstadoEnum {
  switch (status) {
    case PublicationStatus.ACTIVO: return EstadoEnum.ACTIVO;
    case PublicationStatus.INACTIVO: return EstadoEnum.INACTIVO;
  }
}

function mapTypeFromPrisma(type: TipoEnum): PublicationType {
  switch (type) {
    case TipoEnum.FULLTIME: return PublicationType.FULLTIME;
    case TipoEnum.PARTTIME: return PublicationType.PARTTIME;
  }
}

function mapStatusFromPrisma(status: EstadoEnum): PublicationStatus {
  switch (status) {
    case EstadoEnum.ACTIVO: return PublicationStatus.ACTIVO;
    case EstadoEnum.INACTIVO: return PublicationStatus.INACTIVO;
  }
}

export class PrismaPublicationRepository implements PublicationRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreatePublicationRequest): Promise<Publication> {
    const p = await this.prisma.publicacion.create({
      data: {
        idUsuario: data.idUsuario,
        titulo: data.titulo,
        descripcion: data.descripcion,
        remuneracion: data.remuneracion,
        tipo: mapTypeToPrisma(data.tipo),
        estado: EstadoEnum.ACTIVO,   // 🔹 se fija por defecto
        fecha_cierre: data.fechaCierre,
        idUbicacion: data.idUbicacion,
        idCategoria: data.idCategoria,
        fecha_publicacion: new Date(),
      },
    });

    return {
      idPublicacion: p.idPublicacion,
      idUsuario: p.idUsuario,
      titulo: p.titulo,
      descripcion: p.descripcion,
      remuneracion: p.remuneracion,
      tipo: mapTypeFromPrisma(p.tipo),
      estado: mapStatusFromPrisma(p.estado),
      idUbicacion: p.idUbicacion,
      idCategoria: p.idCategoria,
      fechaPublicacion: p.fecha_publicacion,
      fechaCierre: p.fecha_cierre ?? undefined,
    };
  }


  async validateRelatedEntities(idUbicacion: number, idCategoria: number): Promise<boolean> {
    const [ubicacion, categoria] = await Promise.all([
      this.prisma.ubicacion.findUnique({ where: { idUbicacion } }),
      this.prisma.categoria.findUnique({ where: { idCategoria } }),
    ]);
    return !!(ubicacion && categoria);
  }

  async delete(request: DeletePublicationRequest): Promise<boolean> {
    const publication = await this.prisma.publicacion.findUnique({
      where: { idPublicacion: request.idPublicacion },
    });

    if (!publication || publication.idUsuario !== request.idUsuario) {
      return false;
    }

    await this.prisma.publicacion.delete({
      where: { idPublicacion: request.idPublicacion },
    });

    return true;
  }

// 📍 Archivo: lib/repositories/prisma-publication-repository.ts

// ... (otros imports y código de la clase)

  async list(params: {
    page?: number;
    limit?: number;
    filters?: {
      titulo?: string;
      tipo?: PublicationType;
      estado?: PublicationStatus;
      idCategoria?: number;
      idUbicacion?: number;
    };
    sort?: { field: string; order: 'asc' | 'desc' };
  }): Promise<{ publications: Publication[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      filters = {},
      // El sort que llega aquí viene en camelCase desde el servicio
      sort = { field: 'fechaPublicacion', order: 'desc' },
    } = params;

    const skip = (page - 1) * limit;

    const whereClause: Record<string, any> = {};
    if (filters.titulo) whereClause.titulo = { contains: filters.titulo, mode: 'insensitive' };
    if (filters.idCategoria) whereClause.idCategoria = filters.idCategoria;
    if (filters.estado) whereClause.estado = mapStatusToPrisma(filters.estado);
    if (filters.tipo) whereClause.tipo = mapTypeToPrisma(filters.tipo);


    // Mapa para traducir campos de ordenamiento de camelCase a snake_case
    const sortFieldMap: Record<string, string> = {
      fechaPublicacion: 'fecha_publicacion',
      remuneracion: 'remuneracion',
      titulo: 'titulo',
    };
    
    // Obtenemos el nombre real de la columna para la base de datos
    const orderByField = sortFieldMap[sort.field] || 'fecha_publicacion';

    const [publicationsRaw, total] = await this.prisma.$transaction([
      this.prisma.publicacion.findMany({
        skip,
        take: limit,
        where: whereClause,
        // Usamos el nombre del campo ya traducido
        orderBy: { [orderByField]: sort.order },
      }),
      this.prisma.publicacion.count({ where: whereClause }),
    ]);

    const publications: Publication[] = publicationsRaw.map((p) => ({
      idPublicacion: p.idPublicacion,
      idUsuario: p.idUsuario,
      titulo: p.titulo,
      descripcion: p.descripcion,
      remuneracion: p.remuneracion,
      tipo: mapTypeFromPrisma(p.tipo),
      estado: mapStatusFromPrisma(p.estado),
      idUbicacion: p.idUbicacion,
      idCategoria: p.idCategoria,
      fechaPublicacion: p.fecha_publicacion,
      fechaCierre: p.fecha_cierre ?? undefined,
    }));

    return { publications, total };
  }
}
