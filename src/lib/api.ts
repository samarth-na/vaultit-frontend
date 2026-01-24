const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export async function apiRequest(
  endpoint: string,
  options?: RequestInit
): Promise<Response> {
  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
}
