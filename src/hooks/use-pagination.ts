import { useState, useMemo } from "react";

export function usePagination<T>(items: T[], itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (safeCurrentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, safeCurrentPage, itemsPerPage]);

  const resetPage = () => setCurrentPage(1);

  return {
    currentPage: safeCurrentPage,
    totalPages,
    paginatedItems,
    setCurrentPage,
    resetPage,
    totalItems: items.length,
    startIndex: (safeCurrentPage - 1) * itemsPerPage,
  };
}
