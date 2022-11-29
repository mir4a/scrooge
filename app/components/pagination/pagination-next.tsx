import * as React from "react";
import Button from "../form/button";
import { PaginationContext } from "./pagination-context";

export default function PaginationNext() {
  const { page, onChangePage, totalPages } =
    React.useContext(PaginationContext);
  const disabled = page === totalPages;

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
