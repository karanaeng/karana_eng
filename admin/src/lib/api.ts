const DEFAULT_API_BASE_URL = import.meta.env.PROD
  ? 'https://karanaagency.onrender.com'
  : 'http://localhost:4000';

export class ApiError extends Error {
  status: number;
  details?: string;
  setup?: string;

  constructor(message: string, status: number, details?: string, setup?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
    this.setup = setup;
  }
}

export const getApiBaseUrl = () =>
  (import.meta.env.VITE_ADMIN_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '');

export const apiUrl = (path: string) =>
  `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;

export const assetUrl = (url?: string | null) => {
  if (!url) return '';
  if (url === '/placeholder.svg') return url;
  if (url.startsWith('/uploads/')) return apiUrl(url);
  if (url.startsWith('uploads/')) return apiUrl(`/${url}`);

  try {
    const parsed = new URL(url);
    if (parsed.pathname.startsWith('/uploads/') && ['localhost', '127.0.0.1'].includes(parsed.hostname)) {
      return apiUrl(parsed.pathname);
    }
  } catch {
    // Non-URL strings fall through unchanged so normal public assets still work.
  }

  return url;
};

export const apiFetch = async <T>(path: string, options?: RequestInit): Promise<T> => {
  let response: Response;

  try {
    response = await fetch(apiUrl(path), options);
  } catch {
    throw new ApiError(
      `Unable to reach the backend at ${getApiBaseUrl()}. Start the server with "cd server && npm start" and verify VITE_ADMIN_API_BASE_URL if you changed the port.`,
      0,
    );
  }

  let payload: any = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new ApiError(
      payload?.message || `Request failed with status ${response.status}`,
      response.status,
      payload?.details,
      payload?.setup,
    );
  }

  return payload as T;
};
