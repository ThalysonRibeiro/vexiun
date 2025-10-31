import { ERROR_MESSAGES } from "../errors";

export async function fetchAPI<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);
  }

  return result.data;
}
