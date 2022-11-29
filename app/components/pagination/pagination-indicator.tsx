import usePagination from "./use-pagination";

export default function PaginationIndicator() {
  const { page, totalPages } = usePagination();
  return (
    <span className="mx-4 text-gray-500 dark:text-gray-400">
      {page} of {totalPages}
    </span>
  );
}
