import * as React from "react";
import { PaginationContext } from "./pagination-context";

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  page?: number;
  totalPages?: number;
  onChangePage?: (page: number) => void;
  children?: React.ReactNode;
}

export default function Pagination({
  page = 1,
  totalPages = 1,
  onChangePage,
  children,
  ...props
}: PaginationProps) {
  return (
    <PaginationContext.Provider value={{ page, onChangePage, totalPages }}>
      <div {...props}>{children}</div>
    </PaginationContext.Provider>
  );
}
