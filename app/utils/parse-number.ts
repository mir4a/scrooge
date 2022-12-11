// helper function to parse anything to number
export default function parseNumber(value: string | null | undefined): number {
  const parsedValue = parseFloat(value || "");
  return Number.isNaN(parsedValue) ? 0 : parsedValue;
}
