export const API_BASE_URL = "http://65.1.116.194:5000".replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function buildUrl(path: string): string {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);
  if (!response.ok || data?.success === false) {
    throw new ApiError(
      data?.message || `Request failed with status ${response.status}`,
      response.status,
      data,
    );
  }
  return data as T;
}

export const api = {
  get: async <T>(path: string, headers?: HeadersInit): Promise<T> => {
    const response = await fetch(buildUrl(path), {
      method: "GET",
      headers,
      cache: "no-store",
    });
    return parseResponse<T>(response);
  },
  post: async <T>(path: string, body?: unknown, headers?: HeadersInit): Promise<T> => {
    const response = await fetch(buildUrl(path), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return parseResponse<T>(response);
  },
  put: async <T>(path: string, body?: unknown, headers?: HeadersInit): Promise<T> => {
    const response = await fetch(buildUrl(path), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return parseResponse<T>(response);
  },
};

export const apiRoutes = {
  auth: {
    logout: "/api/v1/logout",
  },
  maid: {
    register: "/api/v1/maids/register",
    login: "/api/v1/maids/login",
    me: "/api/v1/maids/me",
    list: "/api/v1/maids/list",
    byId: (id: string) => `/api/v1/maids/${id}`,
  },
  user: {
    register: "/api/v1/user/register",
    login: "/api/v1/user/login",
    me: "/api/v1/user/me",
  },
};
