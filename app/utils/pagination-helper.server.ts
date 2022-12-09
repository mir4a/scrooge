// Cursor based pagination
// 1. first page
// 1.1. do we go to the next page?
// 1.1.1. cursor is the last record id
// 1.1.2. skip 1 record (the last one)
// 1.2. do we go to the previous page?
// 1.2.1. prevent from querying since we don't have the previous page cursor (or return the first page query) or return memoized query
// 1.2.2. cursor is the last record id
// 1.2.3. skip 0 records
// 2. second/n-th page
// 2.1. do we go to the next page?
// 2.1.1. cursor is the last record id
// 2.1.2. skip 1 record (the last one)
// 2.2. do we go to the previous page?
// 2.2.1. cursor is the first record id
// 2.2.2. skip 1 record (the first one)
// 3. last page
// 3.1. do we go to the next page?
// 3.1.1. prevent from querying since we don't have the next page cursor (or return the last page query) or return memoized query
// 3.1.2. cursor is the first record id
// 3.1.3. skip 0 records
// 3.2. do we go to the previous page?
// 3.2.1. cursor is the first record id
// 3.2.2. skip 1 record (the first one)

import {
  DEFAULT_RECORDS_PER_PAGE,
  MAX_RECORDS_PER_PAGE,
  PaginationTerms,
} from "./pagination-const";
import parseNumber from "./parse-number";

interface PaginationHelperArgs {
  total: number;
  cursor?: string | null;
  limit?: string | null;
  page?: string | null;
  prevPage?: string | null;
}

type PaginationHelperResult = {
  skip: number;
  take: number;
  pagesTotal: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export default function paginationHelper({
  total,
  cursor,
  limit,
  page,
  prevPage,
}: PaginationHelperArgs): PaginationHelperResult {
  const parsedPage = parseNumber(page);
  const parsedPrevPage = parseNumber(prevPage);
  const parsedLimit = parseNumber(limit);
  const isBackward = parsedPage < parsedPrevPage;
  const isOnlyLimit = parsedPage <= 0 && limit;
  const isLimitSafe = Math.abs(parsedLimit) <= MAX_RECORDS_PER_PAGE;
  const safeLimit = isLimitSafe
    ? parsedLimit
    : isBackward
    ? -MAX_RECORDS_PER_PAGE
    : MAX_RECORDS_PER_PAGE;
  const pagesTotal = Math.ceil(total / Math.abs(Number(safeLimit)));
  const isLastPage = parsedPage >= pagesTotal;
  const isFirstPage = parsedPage <= 1;

  const skip = isFirstPage && isBackward ? 0 : 1;

  // no cursor or no page fallback to the first page
  if (!cursor || !page) {
    return {
      skip: 0,
      take: Math.abs(safeLimit),
      pagesTotal,
      hasNextPage: true,
      hasPreviousPage: false,
    };
  }

  return {
    skip,
    pagesTotal,
    take:
      (isLastPage && !isBackward) || isOnlyLimit || (isFirstPage && isBackward)
        ? Math.abs(safeLimit)
        : safeLimit,
    hasNextPage: !isLastPage,
    hasPreviousPage: !isFirstPage,
  };
}

export function getPaginationTermsFromURL(url: string): {
  page: string | null;
  prevPage: string | null;
  limit: string;
  cursor: string | null;
} {
  const urlObject = new URL(url);
  const searchParams = urlObject.searchParams;
  const page = searchParams.get(PaginationTerms.PAGE);
  const prevPage = searchParams.get(PaginationTerms.PREV_PAGE);
  const limit =
    searchParams.get(PaginationTerms.LIMIT) ?? String(DEFAULT_RECORDS_PER_PAGE);
  const cursor = searchParams.get(PaginationTerms.CURSOR);

  return {
    page,
    prevPage,
    limit,
    cursor,
  };
}
