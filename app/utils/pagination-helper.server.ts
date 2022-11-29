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
// TODO: refactor pagination logic into a separate function
export const MAX_RECORDS_PER_PAGE = 100;
export const DEFAULT_RECORDS_PER_PAGE = 10;

interface PaginationHelperArgs {
  total: number;
  cursor?: string | null;
  limit?: string | null;
  page?: string | null;
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
}: PaginationHelperArgs): PaginationHelperResult {
  const parsedPage = Number(page);
  const parsedLimit = Number(limit);
  const isBackward = Number(limit) < 0;
  const isLimitSafe = Math.abs(parsedLimit) <= MAX_RECORDS_PER_PAGE;
  const safeLimit = isLimitSafe
    ? parsedLimit
    : isBackward
    ? -MAX_RECORDS_PER_PAGE
    : MAX_RECORDS_PER_PAGE;
  const pagesTotal = Math.ceil(total / Math.abs(Number(safeLimit)));

  const isFirstPage = parsedPage === 1;
  const isInitialPage = parsedPage === 0;
  const isLastPage = parsedPage >= pagesTotal;
  const isWeirdPageAndNoCursor = (parsedPage > 1 || parsedPage < 0) && !cursor;
  const skip =
    (isInitialPage && !isBackward) ||
    isWeirdPageAndNoCursor ||
    (isLastPage && !isBackward)
      ? 0
      : 1;

  return {
    skip,
    pagesTotal,
    take: Number(safeLimit),
    hasNextPage: !isLastPage,
    hasPreviousPage: !isFirstPage,
  };
}
