// helper function to parse anything to number
export default function parseNumber(value: string | null | undefined): number {
  const parsedValue = parseInt(value || "", 10);
  return Number.isNaN(parsedValue) ? 0 : parsedValue;
}
