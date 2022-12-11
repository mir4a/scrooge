import * as React from "react";

export interface PaginationContextValue {
  page: number;
  totalPages: number;
  onChangePage?: (page: number) => void;
}

export const PaginationContext = React.createContext<PaginationContextValue>(
  {} as PaginationContextValue
);
