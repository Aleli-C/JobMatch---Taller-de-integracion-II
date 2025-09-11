// Implementación mock para desarrollo sin BD (lógica compartida)
import { PublicationRepository } from './publication-repository';
import { 
  Publication, 
  CreatePublicationRequest, 
  PublicationStatus, 
  ListPublicationsParams, 
  PublicationFilters,
  DeletePublicationRequest
} from '../types/publication';

export class MockPublicationRepository implements PublicationRepository {
  private publications: Publication[] = [];
  private nextId = 1;

  // 🔧 Estrategias de filtrado declarativas - ZERO condicionales
  private filterStrategies: Record<keyof PublicationFilters, (p: Publication, v: any) => boolean> = {
    titulo: (p, v) => p.titulo.toLowerCase().includes(v.toLowerCase()),
    tipo: (p, v) => p.tipo === v,
    estado: (p, v) => p.estado === v,
    idCategoria: (p, v) => p.idCategoria === v,
    idUbicacion: (p, v) => p.idUbicacion === v,
    remuneracionMin: (p, v) => p.remuneracion >= v,
    remuneracionMax: (p, v) => p.remuneracion <= v,
    fechaDesde: (p, v) => p.fechaPublicacion >= v,
    fechaHasta: (p, v) => p.fechaPublicacion <= v,
  };

  // 📊 Estrategias de ordenamiento declarativas
  private sortStrategies: Record<string, (a: Publication, b: Publication) => number> = {
    fechaPublicacion: (a, b) => a.fechaPublicacion.getTime() - b.fechaPublicacion.getTime(),
    remuneracion: (a, b) => a.remuneracion - b.remuneracion,
    titulo: (a, b) => a.titulo.localeCompare(b.titulo),
  };

  async create(data: CreatePublicationRequest): Promise<Publication> {
    const publication: Publication = {
      idPublicacion: this.nextId++,
      ...data,
      estado: PublicationStatus.ACTIVO,
      fechaPublicacion: new Date()
    };

    this.publications.push(publication);
    return publication;
  }

  async validateRelatedEntities(ubicacionId: number, categoriaId: number): Promise<boolean> {
    // La validación en el mock es simplificada
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

  async findById(id: number): Promise<Publication | undefined> {
    return this.publications.find(p => p.idPublicacion === id);
  }

  async delete(data: DeletePublicationRequest): Promise<boolean> {
    const index = this.publications.findIndex(
      p => p.idPublicacion === data.idPublicacion && p.idUsuario === data.idUsuario
    );

    if (index === -1) {
      // Si la publicación no existe o el ownership no coincide, devolvemos false
      return false;
    }

    this.publications.splice(index, 1);
    return true;
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
      return [...publications].sort((a, b) => b.fechaPublicacion.getTime() - a.fechaPublicacion.getTime());
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