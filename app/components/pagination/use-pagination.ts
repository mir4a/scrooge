import { useSearchParams, useSubmit } from "@remix-run/react";
import {
  DEFAULT_RECORDS_PER_PAGE,
  PaginationTerms,
} from "~/utils/pagination-const";
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
  const page = searchParams.get(PaginationTerms.PAGE) || "1";
  const limit =
    searchParams.get(PaginationTerms.LIMIT) || String(DEFAULT_RECORDS_PER_PAGE);
  const cursor = searchParams.get(PaginationTerms.CURSOR) || null;
  const parsedLimit = parseInt(limit, 10);
  const parsedPage = parseInt(page, 10);
  const totalPages = Math.ceil(total / Math.abs(parsedLimit));

  const callback = (newPage: number) => {
    const isOverrun = newPage > totalPages;
    // const isWeirdPageAndNoCursor =
    //   (parsedPage < 0 || parsedPage > 1) && !cursor;

    // FIXME: there's an issue when going to the last page and back moves the cursor one entry back
    // existing query params to FormData
    const formData = queryToFormData(searchParams);
    const isBackward = newPage < Number(page);
    const calculatedLimit = isBackward
      ? -Math.abs(parsedLimit)
      : Math.abs(parsedLimit);
    const calculatedCursor =
      isBackward || isOverrun ? data[0].id : data[data.length - 1].id;
    // update form data with new cursor
    formData.set(PaginationTerms.CURSOR, calculatedCursor);
    formData.set(PaginationTerms.LIMIT, String(calculatedLimit));

    if (isOverrun) {
      formData.set(PaginationTerms.PAGE, String(totalPages));
    } else {
      formData.set(PaginationTerms.PAGE, String(newPage));
    }
    submit(formData);
  };

  return [{ page: parsedPage, limit: parsedLimit, cursor }, callback];
}
