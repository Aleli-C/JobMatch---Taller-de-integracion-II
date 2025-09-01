// Implementación mock para desarrollo sin BD (lógica compartida) Es por el momento como no tenemos BD
import { PublicationRepository } from './publication-repository';
import { Publication, CreatePublicationRequest, PublicationStatus, ListPublicationsParams, PublicationFilters } from '../types/publication';

export class MockPublicationRepository implements PublicationRepository {
  private publications: Publication[] = [];
  private nextId = 1;

  // 🔧 Estrategias de filtrado declarativas - ZERO condicionales
  private filterStrategies: Record<keyof PublicationFilters, (p: Publication, v: any) => boolean> = {
    titulo: (p, v) => p.titulo.toLowerCase().includes(v.toLowerCase()),
    tipo: (p, v) => p.tipo === v,
    estado: (p, v) => p.estado === v,
    id_categoria: (p, v) => p.id_categoria === v,
    id_ubicacion: (p, v) => p.id_ubicacion === v,
    remuneracion_min: (p, v) => p.remuneracion >= v,
    remuneracion_max: (p, v) => p.remuneracion <= v,
    fecha_desde: (p, v) => p.fecha_publicacion >= v,
    fecha_hasta: (p, v) => p.fecha_publicacion <= v,
  };

  // 📊 Estrategias de ordenamiento declarativas
  private sortStrategies: Record<string, (a: Publication, b: Publication) => number> = {
    fecha_publicacion: (a, b) => a.fecha_publicacion.getTime() - b.fecha_publicacion.getTime(),
    remuneracion: (a, b) => a.remuneracion - b.remuneracion,
    titulo: (a, b) => a.titulo.localeCompare(b.titulo),
  };

  async create(data: CreatePublicationRequest): Promise<Publication> {
    const publication: Publication = {
      id_publicacion: this.nextId++,
      ...data,
      estado: PublicationStatus.ACTIVA,
      fecha_publicacion: new Date()
    };

    this.publications.push(publication);
    return publication;
  }

  async validateRelatedEntities(ubicacionId: number, categoriaId: number): Promise<boolean> {
    return ubicacionId > 0 && categoriaId > 0;
  }

  async list(params: ListPublicationsParams): Promise<{ publications: Publication[]; total: number }> {
    let result = this.applyFilters(this.publications, params.filters);
    result = this.applySorting(result, params.sort);
    const paginated = this.applyPagination(result, params.page, params.limit);

    return {
      publications: paginated,
      total: result.length
    };
  }

  // Filtros usando Strategy Pattern
  public applyFilters(publications: Publication[], filters?: PublicationFilters): Publication[] {
    if (!filters) return publications;

    return publications.filter(publication => 
      Object.entries(filters)
        .filter(([_, value]) => value !== undefined)
        .every(([key, value]) => this.matchesFilter(publication, key as keyof PublicationFilters, value))
    );
  }

  private matchesFilter(publication: Publication, filterKey: keyof PublicationFilters, filterValue: any): boolean {
    return this.filterStrategies[filterKey]
      ? this.filterStrategies[filterKey](publication, filterValue)
      : true;
  }

  // Ordenamiento usando Strategy Pattern
  public applySorting(publications: Publication[], sort?: { field: string; order: string }): Publication[] {
    if (!sort) {
      return [...publications].sort((a, b) => b.fecha_publicacion.getTime() - a.fecha_publicacion.getTime());
    }

    const sortFn = this.sortStrategies[sort.field];
    if (!sortFn) return publications;

    return [...publications].sort((a, b) => {
      const result = sortFn(a, b);
      return sort.order === 'desc' ? -result : result;
    });
  }

  // Paginación simple y funcional
  public applyPagination(publications: Publication[], page = 1, limit = 10): Publication[] {
    const startIndex = (page - 1) * limit;
    return publications.slice(startIndex, startIndex + limit);
  }
}