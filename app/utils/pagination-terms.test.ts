import {
  getPaginationTermsFromURL,
  getPaginationTermsFromSearchParams,
} from "./pagination-terms";

describe("getPaginationTermsFromSearchParams", () => {
  it("should return default values if empty url search params", () => {
    const searchParams = new URLSearchParams();
    const { cursor, limit, page, prevPage } =
      getPaginationTermsFromSearchParams(searchParams);

    expect(cursor).toBe(null);
    expect(limit).toBe("10");
    expect(page).toBe(null);
    expect(prevPage).toBe(null);
  });

  it("should return correct values when url search params contain them", () => {
    const searchParams = new URLSearchParams(
      "page=1&prevPage=2&limit=5&cursor=10"
    );
    const { cursor, limit, page, prevPage } =
      getPaginationTermsFromSearchParams(searchParams);

    expect(cursor).toBe("10");
    expect(limit).toBe("5");
    expect(page).toBe("1");
    expect(prevPage).toBe("2");
  });
});

describe("getPaginationTermsFromURL", () => {
  it("should return default values if empty url", () => {
    const url = "http://localhost:3000";
    const { cursor, limit, page, prevPage } = getPaginationTermsFromURL(url);

    expect(cursor).toBe(null);
    expect(limit).toBe("10");
    expect(page).toBe(null);
    expect(prevPage).toBe(null);
  });

  it("should return correct values when url contains them", () => {
    const url = "http://localhost:3000?page=1&prevPage=2&limit=5&cursor=10";
    const { cursor, limit, page, prevPage } = getPaginationTermsFromURL(url);

    expect(cursor).toBe("10");
    expect(limit).toBe("5");
    expect(page).toBe("1");
    expect(prevPage).toBe("2");
  });
});
