import { MAX_RECORDS_PER_PAGE } from "./pagination-terms";
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
