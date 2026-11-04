/** Removes server internals (stack traces) from a backend JSON error before it reaches the browser. */
export function cleanBody<T>(data: T): T {
  if (data && typeof data === "object" && !Array.isArray(data) && "stack" in data) {
    const { stack: _stack, ...rest } = data as Record<string, unknown>;
    void _stack;
    return rest as T;
  }
  return data;
}

/**
 * GET to the backend with a short timeout and one retry. The backend sometimes stalls for several
 * seconds or drops a request; failing fast and trying once more is quicker than waiting it out.
 */
export async function fetchUpstream(url: string, init: RequestInit = {}, attempts = 2): Promise<Response> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await fetch(url, { ...init, signal: AbortSignal.timeout(6000) });
      if (response.status < 500 || i === attempts - 1) return response;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError ?? new Error("Upstream unavailable");
}
