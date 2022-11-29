import Button from "../form/button";
import usePaginationContext from "./use-pagination-context";

export default function PaginationPrev() {
  const { page, totalPages, onChangePage } = usePaginationContext();
  const disabled = page === 1;

  if (totalPages <= 1) return null;

  return (
    <Button
      size="small"
      disabled={disabled}
      onClick={() => onChangePage?.(page - 1)}
    >
      Prev
    </Button>
  );
}
