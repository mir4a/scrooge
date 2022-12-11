export const MAX_RECORDS_PER_PAGE = 100;
export const DEFAULT_RECORDS_PER_PAGE = 10;

export enum PaginationTerms {
  PAGE = "page",
  PREV_PAGE = "prevPage",
  LIMIT = "limit",
  CURSOR = "cursor",
}

export type PaginationTermsResult = {
  page: string | null;
  prevPage: string | null;
  limit: string;
  cursor: string | null;
};

export function getPaginationTermsFromURL(url: string): PaginationTermsResult {
  const urlObject = new URL(url);
  const searchParams = urlObject.searchParams;

  return getPaginationTermsFromSearchParams(searchParams);
}

export function getPaginationTermsFromSearchParams(
  searchParams: URLSearchParams
): PaginationTermsResult {
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
