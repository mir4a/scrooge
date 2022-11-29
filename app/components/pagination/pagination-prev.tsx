import * as React from "react";
import Button from "../form/button";
import { PaginationContext } from "./pagination-context";

export default function PaginationPrev() {
  const { page, onChangePage } = React.useContext(PaginationContext);
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
