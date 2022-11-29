import * as React from "react";
import { PaginationContext } from "./pagination-context";

export default function usePagination() {
  return React.useContext(PaginationContext);
}
