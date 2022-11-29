import Button from "../form/button";
import usePaginationContext from "./use-pagination-context";

export default function PaginationPrev() {
  const { page, onChangePage } = usePaginationContext();
  const disabled = page === 1;
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
