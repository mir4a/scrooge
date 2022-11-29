import Button from "../form/button";
import usePaginationContext from "./use-pagination-context";

export default function PaginationNext() {
  const { page, onChangePage, totalPages } = usePaginationContext();
  const disabled = page === totalPages;

  if (totalPages <= 1) return null;

  return (
    <Button
      disabled={disabled}
      size="small"
      onClick={() => {
        onChangePage?.(page + 1);
      }}
    >
      Next
    </Button>
  );
}
