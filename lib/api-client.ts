import { ApiEnvelope } from '@/lib/api-types';

// Falls back to the dev server found in docs/Atom Mobile App.postman_collection.json.
// Override with EXPO_PUBLIC_API_URL in .env for a different environment.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://dev-atom-api.tw1.com/v1';

export class ApiError extends Error {
  code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.name = 'ApiError';
  }
}

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
}

function buildUrl(path: string, query?: RequestOptions['query']) {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query } = options;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const response = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Some endpoints (e.g. PATCH /sale-order) return 204 No Content on success.
  if (response.status === 204) {
    return {} as T;
  }

  const json = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok) {
    throw new ApiError(json.code ?? response.status, json.message || 'Request failed');
  }

  return json.data;
}
