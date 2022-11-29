export function queryToFormData(query: URLSearchParams): FormData {
  const formData = new FormData();
  for (const [key, value] of query) {
    formData.set(key, value);
  }
  return formData;
}
