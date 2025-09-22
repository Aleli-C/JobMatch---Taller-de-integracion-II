import { PrismaClient, Prisma, TipoTrabajo, EstadoPublicacion } from "@prisma/client";
import { PublicationRepository } from "./publication-repository";
import {
  Publication,
  CreatePublicationRequest,
  DeletePublicationRequest,
  PublicationType,
  PublicationStatus,
} from "../types/publication";

// helpers enum
const mapTypeToPrisma = (t: PublicationType): TipoTrabajo =>
  t === PublicationType.FULLTIME ? TipoTrabajo.FULLTIME
  : t === PublicationType.PARTTIME ? TipoTrabajo.PARTTIME
  : TipoTrabajo.FREELANCE;

const mapStatusToPrisma = (s: PublicationStatus): EstadoPublicacion =>
  s === PublicationStatus.ACTIVO ? EstadoPublicacion.ACTIVO
  : s === PublicationStatus.INACTIVO ? EstadoPublicacion.INACTIVO
  : EstadoPublicacion.CERRADO;

const mapTypeFromPrisma = (t: TipoTrabajo): PublicationType =>
  t === TipoTrabajo.FULLTIME ? PublicationType.FULLTIME
  : t === TipoTrabajo.PARTTIME ? PublicationType.PARTTIME
  : PublicationType.FREELANCE;

const mapStatusFromPrisma = (s: EstadoPublicacion): PublicationStatus =>
  s === EstadoPublicacion.ACTIVO ? PublicationStatus.ACTIVO
  : s === EstadoPublicacion.INACTIVO ? PublicationStatus.INACTIVO
  : PublicationStatus.CERRADO;

// convertir Decimal -> number para tu capa de dominio
const toNumber = (v: Prisma.Decimal | number): number =>
  typeof v === "number" ? v : (v as unknown as Prisma.Decimal).toNumber();

export class PrismaPublicationRepository implements PublicationRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreatePublicationRequest): Promise<Publication> {
    const p = await this.prisma.publicacion.create({
      data: {
        usuarioId: data.idUsuario,
        titulo: data.titulo,
        descripcion: data.descripcion,
        remuneracion: new Prisma.Decimal(data.remuneracion), // guardar como Decimal
        tipo: mapTypeToPrisma(data.tipo),
        estado: EstadoPublicacion.ACTIVO,
        fechaCierre: data.fechaCierre ?? null,
        ubicacionId: data.idUbicacion,
        categoriaId: data.idCategoria,
        // fechaPublicacion se autogenera
      },
    });

    return {
      idPublicacion: p.id,
      idUsuario: p.usuarioId,
      titulo: p.titulo,
      descripcion: p.descripcion,
      remuneracion: toNumber(p.remuneracion), // ← evita el error de tipo
      tipo: mapTypeFromPrisma(p.tipo),
      estado: mapStatusFromPrisma(p.estado),
      idUbicacion: p.ubicacionId,
      idCategoria: p.categoriaId,
      fechaPublicacion: p.fechaPublicacion,
      fechaCierre: p.fechaCierre ?? undefined,
    };
  }

  async validateRelatedEntities(idUbicacion: number, idCategoria: number): Promise<boolean> {
    const [ubicacion, categoria] = await Promise.all([
      this.prisma.ubicacion.findUnique({ where: { id: idUbicacion } }),
      this.prisma.categoria.findUnique({ where: { id: idCategoria } }),
    ]);
    return Boolean(ubicacion && categoria);
  }

  async delete(req: DeletePublicationRequest): Promise<boolean> {
    const pub = await this.prisma.publicacion.findUnique({
      where: { id: req.idPublicacion },
      select: { id: true, usuarioId: true },
    });
    if (!pub || pub.usuarioId !== req.idUsuario) return false;

    await this.prisma.publicacion.delete({ where: { id: req.idPublicacion } });
    return true;
  }

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
    sort?: { field: "fechaPublicacion" | "remuneracion" | "titulo"; order: "asc" | "desc" };
  }): Promise<{ publications: Publication[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      filters = {},
      sort = { field: "fechaPublicacion", order: "desc" },
    } = params;

    const skip = (page - 1) * limit;

    const where: Prisma.PublicacionWhereInput = {
      titulo: filters.titulo ? { contains: filters.titulo } : undefined,
      categoriaId: filters.idCategoria,
      ubicacionId: filters.idUbicacion,
      estado: filters.estado ? mapStatusToPrisma(filters.estado) : undefined,
      tipo: filters.tipo ? mapTypeToPrisma(filters.tipo) : undefined,
    };

    let orderBy: Prisma.PublicacionOrderByWithRelationInput;
    switch (sort.field) {
      case "remuneracion": orderBy = { remuneracion: sort.order }; break;
      case "titulo": orderBy = { titulo: sort.order }; break;
      default: orderBy = { fechaPublicacion: sort.order }; break;
    }

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.publicacion.findMany({ skip, take: limit, where, orderBy }),
      this.prisma.publicacion.count({ where }),
    ]);

    const publications: Publication[] = rows.map((p) => ({
      idPublicacion: p.id,
      idUsuario: p.usuarioId,
      titulo: p.titulo,
      descripcion: p.descripcion,
      remuneracion: toNumber(p.remuneracion), // ← corrige el array mapeado
      tipo: mapTypeFromPrisma(p.tipo),
      estado: mapStatusFromPrisma(p.estado),
      idUbicacion: p.ubicacionId,
      idCategoria: p.categoriaId,
      fechaPublicacion: p.fechaPublicacion,
      fechaCierre: p.fechaCierre ?? undefined,
    }));

    return { publications, total };
  }
}
