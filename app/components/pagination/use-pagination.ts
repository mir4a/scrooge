import { useSearchParams, useSubmit } from "@remix-run/react";
import {
  getPaginationTermsFromSearchParams,
  PaginationTerms,
} from "~/utils/pagination-terms";
import parseNumber from "~/utils/parse-number";
import { queryToFormData } from "~/utils/query-to-form-data";

export type PaginationGenericData = {
  id: string;
};

export interface PaginationProps {
  data: PaginationGenericData[];
  total: number;
}

export type PaginationResult = [
  {
    page: number;
    limit: number;
    totalPages: number;
    cursor?: string | null;
    error?: Error | null;
  },
  (page: number) => void
];

export default function usePagination({
  data,
  total,
}: PaginationProps): PaginationResult {
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const { page, limit, cursor } =
    getPaginationTermsFromSearchParams(searchParams);
  const parsedPage = parseNumber(page);
  const parsedLimit = parseNumber(limit);
  const totalPages = Math.ceil(total / Math.abs(parsedLimit));

  const callback = (newPage: number) => {
    const isOverrun = newPage > totalPages;
    const formData = queryToFormData(searchParams);
    const isBackward = newPage < parsedPage;
    const calculatedLimit = isBackward
      ? -Math.abs(parsedLimit)
      : Math.abs(parsedLimit);
    const calculatedCursor =
      isBackward || isOverrun ? data[0]?.id : data[data.length - 1]?.id;
    // update form data with new cursor
    if (newPage === 1) {
      // no need to send cursor if we're on the first page
      formData.delete(PaginationTerms.CURSOR);
      formData.delete(PaginationTerms.PREV_PAGE);
      formData.delete(PaginationTerms.PAGE);
      return submit(formData);
    }

    formData.set(PaginationTerms.CURSOR, calculatedCursor);
    formData.set(PaginationTerms.LIMIT, String(calculatedLimit));

    // set previous page
    const calculatedPreviousPage = isBackward ? newPage + 1 : newPage - 1;
    formData.set(PaginationTerms.PREV_PAGE, String(calculatedPreviousPage));

    if (isOverrun) {
      formData.set(PaginationTerms.PAGE, String(totalPages));
    } else if (newPage < 1) {
      formData.set(PaginationTerms.PAGE, "1");
    } else {
      formData.set(PaginationTerms.PAGE, String(newPage));
    }
    return submit(formData);
  };

  return [
    { page: parsedPage || 1, limit: parsedLimit, cursor, totalPages },
    callback,
  ];
}
