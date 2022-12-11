import praseNumber from "./parse-number";

describe("parseNumber", () => {
  it("should return 0 if value is null", () => {
    expect(praseNumber(null)).toBe(0);
  });

  it("should return 0 if value is undefined", () => {
    expect(praseNumber(undefined)).toBe(0);
  });

  it("should return 0 if value is not a number", () => {
    expect(praseNumber("a")).toBe(0);
  });

  it("should return parsed value if value is a number", () => {
    expect(praseNumber("1")).toBe(1);
  });

  it("should return parsed value if value is a negative number", () => {
    expect(praseNumber("-1")).toBe(-1);
  });

  it("should return parsed value if value is a float number", () => {
    expect(praseNumber("1.1")).toBe(1.1);
  });

  it("should return parsed value if value is a negative float number", () => {
    expect(praseNumber("-1.1")).toBe(-1.1);
  });

  it("should return parsed value if value is a float number with leading 0", () => {
    expect(praseNumber("01.1")).toBe(1.1);
  });

  it("should return parsed value if value is a negative float number with leading 0", () => {
    expect(praseNumber("-01.1")).toBe(-1.1);
  });

  it("should return parsed value if value is a float number with trailing 0", () => {
    expect(praseNumber("1.10")).toBe(1.1);
  });

  it("should return parsed value if value is a negative float number with trailing 0", () => {
    expect(praseNumber("-1.10")).toBe(-1.1);
  });

  it("should return parsed value if value is a float number with leading and trailing 0", () => {
    expect(praseNumber("01.10")).toBe(1.1);
  });

  it("should return parsed value if value is a negative float number with leading and trailing 0", () => {
    expect(praseNumber("-01.10")).toBe(-1.1);
  });

  it("should return parsed value if value is a float number with leading and trailing 0 and multiple dots", () => {
    expect(praseNumber("01.10.1")).toBe(1.1);
  });

  it("should return parsed value if value is a negative float number with leading and trailing 0 and multiple dots", () => {
    expect(praseNumber("-01.10.1")).toBe(-1.1);
  });
});
