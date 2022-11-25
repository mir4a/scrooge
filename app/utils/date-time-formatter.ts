export function toLocaleDate(date: string) {
  const dateObj = new Date(date);
  return dateObj.toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}
