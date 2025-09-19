// lib/utils/pagination.ts

export interface PaginationResult {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Construye un objeto de metadatos de paginación.
 * @param total - El número total de ítems en la colección.
 * @param page - La página actual solicitada.
 * @param limit - El número de ítems por página.
 * @returns Un objeto con la información de la paginación.
 */
export function buildPagination(
  total: number,
  page: number = 1,
  limit: number = 10
): PaginationResult {
  const totalPages = Math.ceil(total / limit);

  return {
    total,
    page,
    limit,
    totalPages,
  };
}
