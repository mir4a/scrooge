import { describe, expect, it } from "vitest";
import paginationHelper from "./pagination-helper.server";

describe("paginationHelper", () => {
  it("should return skip 1 if we're on last page", () => {
    const { skip, take, pagesTotal, hasNextPage, hasPreviousPage } =
      paginationHelper({
        total: 15,
        cursor: "10",
        limit: "5",
        page: "3",
      });

    expect(skip).toBe(1);
    expect(take).toBe(5);
    expect(pagesTotal).toBe(3);
    expect(hasNextPage).toBe(false);
    expect(hasPreviousPage).toBe(true);
  });

  it("should return skip 1 if there is a next page", () => {
    const { skip, take, pagesTotal, hasNextPage, hasPreviousPage } =
      paginationHelper({
        total: 15,
        cursor: "6",
        limit: "5",
        page: "2",
      });

    expect(skip).toBe(1);
    expect(take).toBe(5);
    expect(pagesTotal).toBe(3);
    expect(hasNextPage).toBe(true);
    expect(hasPreviousPage).toBe(true);
  });

  it("should return skip 0 if there's no previous page", () => {
    const { skip, take, pagesTotal, hasNextPage, hasPreviousPage } =
      paginationHelper({
        total: 15,
        cursor: "1",
        limit: "5",
        page: "1",
      });

    expect(skip).toBe(1);
    expect(take).toBe(5);
    expect(pagesTotal).toBe(3);
    expect(hasNextPage).toBe(true);
    expect(hasPreviousPage).toBe(false);
  });

  describe("normalize limit", () => {
    it("should return positive limit if no page provided", () => {
      const { skip, take, pagesTotal, hasNextPage, hasPreviousPage } =
        paginationHelper({
          cursor: "1",
          total: 15,
          limit: "-5",
        });

      expect(skip).toBe(0);
      expect(take).toBe(5);
      expect(pagesTotal).toBe(3);
      expect(hasNextPage).toBe(true);
      expect(hasPreviousPage).toBe(false);
    });

    it("should return positive limit if page is 0", () => {
      const { skip, take, pagesTotal, hasNextPage, hasPreviousPage } =
        paginationHelper({
          total: 15,
          limit: "-5",
          page: "0",
        });

      expect(skip).toBe(0);
      expect(take).toBe(5);
      expect(pagesTotal).toBe(3);
      expect(hasNextPage).toBe(true);
      expect(hasPreviousPage).toBe(false);
    });

    it("should return positive limit if page is negative", () => {
      const { skip, take, pagesTotal, hasNextPage, hasPreviousPage } =
        paginationHelper({
          total: 15,
          limit: "-5",
          page: "-1",
        });

      expect(skip).toBe(0);
      expect(take).toBe(5);
      expect(pagesTotal).toBe(3);
      expect(hasNextPage).toBe(true);
      expect(hasPreviousPage).toBe(false);
    });
  });

  describe("validate page", () => {
    it("should be a first page if passed page is negative", () => {
      const { skip, take, pagesTotal, hasNextPage, hasPreviousPage } =
        paginationHelper({
          total: 15,
          limit: "5",
          page: "-1",
        });

      expect(skip).toBe(0);
      expect(take).toBe(5);
      expect(pagesTotal).toBe(3);
      expect(hasNextPage).toBe(true);
      expect(hasPreviousPage).toBe(false);
    });

    it("should return page 1 if page is 0", () => {
      const { skip, take, pagesTotal, hasNextPage, hasPreviousPage } =
        paginationHelper({
          total: 15,
          limit: "5",
          page: "0",
        });

      expect(skip).toBe(0);
      expect(take).toBe(5);
      expect(pagesTotal).toBe(3);
      expect(hasNextPage).toBe(true);
      expect(hasPreviousPage).toBe(false);
    });

    it("should return page 1 if page is not a number", () => {
      const { skip, take, pagesTotal, hasNextPage, hasPreviousPage } =
        paginationHelper({
          total: 15,
          limit: "5",
          page: "a",
        });

      expect(skip).toBe(0);
      expect(take).toBe(5);
      expect(pagesTotal).toBe(3);
      expect(hasNextPage).toBe(true);
      expect(hasPreviousPage).toBe(false);
    });

    it("should return page 1 if page is not provided", () => {
      const { skip, take, pagesTotal, hasNextPage, hasPreviousPage } =
        paginationHelper({
          total: 15,
          limit: "5",
        });

      expect(skip).toBe(0);
      expect(take).toBe(5);
      expect(pagesTotal).toBe(3);
      expect(hasNextPage).toBe(true);
      expect(hasPreviousPage).toBe(false);
    });

    it("should return last page if parsed page is overrun", () => {
      const { skip, take, pagesTotal, hasNextPage, hasPreviousPage } =
        paginationHelper({
          cursor: "11",
          total: 15,
          limit: "5",
          page: "10",
        });

      expect(skip).toBe(1);
      expect(take).toBe(5);
      expect(pagesTotal).toBe(3);
      expect(hasNextPage).toBe(false);
      expect(hasPreviousPage).toBe(true);
    });
  });
});
