import { Paginated } from "../models/Paginated";

export function usePagination<T>(
  results: Paginated<T>,
  pageSize: number,
  currentOffset: number
) {
  const totalPages = Math.ceil(results.totalItems / pageSize);
  const currentPage = Math.ceil(currentOffset / pageSize) + 1;
  return {
    totalPages,
    currentPage,
    items: results.items,
  };
}
