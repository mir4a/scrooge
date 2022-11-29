import usePaginationContext from "./use-pagination-context";

export default function PaginationIndicator() {
  const { page, totalPages } = usePaginationContext();
  return (
    <span className="mx-4 text-gray-500 dark:text-gray-400">
      {page} of {totalPages}
    </span>
  );
}
