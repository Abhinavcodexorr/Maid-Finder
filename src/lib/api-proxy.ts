/** Removes server internals (stack traces) from a backend JSON error before it reaches the browser. */
export function cleanBody<T>(data: T): T {
  if (data && typeof data === "object" && !Array.isArray(data) && "stack" in data) {
    const { stack: _stack, ...rest } = data as Record<string, unknown>;
    void _stack;
    return rest as T;
  }
  return data;
}
