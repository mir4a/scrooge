import { renderHook } from "@testing-library/react";
import usePagination from "./use-pagination";
import { useSearchParams, useSubmit } from "@remix-run/react";

// helper function for FormData comparison
const formDataToObj = (formData: FormData) => {
  const obj: any = {};
  formData.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
};

// compare two FormData objects
const compareFormData = (formData1: FormData, formData2: FormData) => {
  const obj1 = formDataToObj(formData1);
  const obj2 = formDataToObj(formData2);
  expect(obj1).toEqual(obj2);
};

const submitMock = vi.fn();
vi.mock("@remix-run/react", () => {
  return {
    useSubmit: () => submitMock,
    useSearchParams: vi.fn(),
  };
});

const mockedData = [
  { id: "1" },
  { id: "2" },
  { id: "3" },
  { id: "4" },
  { id: "5" },
  { id: "6" },
  { id: "7" },
  { id: "8" },
  { id: "9" },
  { id: "10" },
  { id: "11" },
  { id: "12" },
  { id: "13" },
  { id: "14" },
  { id: "15" },
];

describe("usePagination", () => {
  beforeEach(() => {
    // useSearchParams.mockReturnValue([(new URLSearchParams()) as any)]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("makes multiple pages when limit is less than total number of entries", async () => {
    (useSearchParams as any).mockReturnValue([
      new URLSearchParams({
        limit: "5",
      }) as any,
    ]);

    const { result } = renderHook(() =>
      usePagination({
        data: mockedData.slice(0, 5),
        total: 15,
      })
    );

    expect(result.current[0].totalPages).toBe(3);
  });

  it("return correct cursor on last page", async () => {
    (useSearchParams as any).mockReturnValue([
      new URLSearchParams({
        limit: "5",
        page: "3",
        cursor: "10",
      }) as any,
    ]);

    const { result } = renderHook(() =>
      usePagination({
        data: mockedData.slice(10, 5),
        total: 15,
      })
    );

    expect(result.current[0].cursor).toBe("10");
  });
});

describe("paginaion callback", () => {
  beforeEach(() => {});

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should set correct cursor on callback when page is overrun", async () => {
    (useSearchParams as any).mockReturnValue([
      new URLSearchParams({
        limit: "5",
        page: "3",
        cursor: "10",
      }) as any,
    ]);

    const submit = useSubmit();
    const data = mockedData.slice(10);

    const { result } = renderHook(() =>
      usePagination({
        data,
        total: 15,
      })
    );

    const callback = result.current[1];
    callback(4);
    expect(submit).toBeCalledTimes(1);

    const expectedFormData = new FormData();
    expectedFormData.append("cursor", "11");
    expectedFormData.append("limit", "5");
    expectedFormData.append("page", "3");
    expectedFormData.append("prevPage", "3");
    compareFormData((submit as any).calls[0][0], expectedFormData);
  });

  it("should set correct cursor on callback on last page", async () => {
    (useSearchParams as any).mockReturnValue([
      new URLSearchParams({
        limit: "5",
        prevPage: "2",
        page: "3",
        cursor: "6",
      }) as any,
    ]);

    const submit = useSubmit();
    const data = mockedData.slice(5, 10);

    const { result } = renderHook(() =>
      usePagination({
        data,
        total: 15,
      })
    );

    const callback = result.current[1];
    callback(3);
    expect(submit).toBeCalledTimes(1);

    const expectedFormData = new FormData();
    expectedFormData.append("cursor", "10");
    expectedFormData.append("limit", "5");
    expectedFormData.append("page", "3");
    expectedFormData.append("prevPage", "2");
    compareFormData((submit as any).calls[0][0], expectedFormData);
  });

  it("should set correct cursor on callback on the penultimate page and go forward", async () => {
    (useSearchParams as any).mockReturnValue([
      new URLSearchParams({
        limit: "5",
        page: "2",
        prevPage: "1",
        cursor: "6",
      }) as any,
    ]);

    const submit = useSubmit();
    const data = mockedData.slice(5, 10);

    const { result } = renderHook(() =>
      usePagination({
        data,
        total: 15,
      })
    );

    const callback = result.current[1];
    callback(3);
    expect(submit).toBeCalledTimes(1);

    const expectedFormData = new FormData();
    expectedFormData.append("cursor", "10");
    expectedFormData.append("limit", "5");
    expectedFormData.append("page", "3");
    expectedFormData.append("prevPage", "2");

    compareFormData((submit as any).calls[0][0], expectedFormData);
  });

  it("should set correct cursor on callback on first page and go forward", async () => {
    (useSearchParams as any).mockReturnValue([
      new URLSearchParams({
        limit: "5",
        page: "1",
        cursor: "1",
      }) as any,
    ]);

    const submit = useSubmit();
    const data = mockedData.slice(0, 5);

    const { result } = renderHook(() =>
      usePagination({
        data,
        total: 15,
      })
    );

    const callback = result.current[1];
    callback(2);
    expect(submit).toBeCalledTimes(1);

    const expectedFormData = new FormData();
    expectedFormData.append("cursor", "5");
    expectedFormData.append("limit", "5");
    expectedFormData.append("page", "2");
    expectedFormData.append("prevPage", "1");
    compareFormData((submit as any).calls[0][0], expectedFormData);
  });

  it("should set correct cursor on callback on first page and go backward", async () => {
    (useSearchParams as any).mockReturnValue([
      new URLSearchParams({
        limit: "5",
        page: "1",
        cursor: "1",
      }) as any,
    ]);

    const submit = useSubmit();
    const data = mockedData.slice(0, 5);

    const { result } = renderHook(() =>
      usePagination({
        data,
        total: 15,
      })
    );

    const callback = result.current[1];
    callback(0);
    expect(submit).toBeCalledTimes(1);

    const expectedFormData = new FormData();
    expectedFormData.append("cursor", "1");
    expectedFormData.append("limit", "-5");
    expectedFormData.append("page", "1");
    expectedFormData.append("prevPage", "1");
    compareFormData((submit as any).calls[0][0], expectedFormData);
  });

  it("should remove cursor, page and prevPage on callback on the second page and go backward", async () => {
    (useSearchParams as any).mockReturnValue([
      new URLSearchParams({
        limit: "-5",
        page: "2",
        prevPage: "3",
        cursor: "11",
      }) as any,
    ]);

    const submit = useSubmit();
    const data = mockedData.slice(5, 10);

    const { result } = renderHook(() =>
      usePagination({
        data,
        total: 15,
      })
    );

    const callback = result.current[1];
    callback(1);
    expect(submit).toBeCalledTimes(1);

    const expectedFormData = new FormData();
    expectedFormData.append("limit", "-5");
    compareFormData((submit as any).calls[0][0], expectedFormData);
  });
});
