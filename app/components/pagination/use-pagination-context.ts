import * as React from "react";
import { PaginationContext } from "./pagination-context";

export default function usePaginationContext() {
  return React.useContext(PaginationContext);
}
