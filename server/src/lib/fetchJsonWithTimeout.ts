export class FetchTimeoutError extends Error {
  readonly name = "FetchTimeoutError";
  constructor(
    message: string = "Request timed out",
    public readonly timeoutMs?: number
  ) {
    super(message);
    Object.setPrototypeOf(this, FetchTimeoutError.prototype);
  }
}

export interface FetchJsonWithTimeoutOptions {
  /** Timeout in milliseconds. If not set, no timeout is applied. */
  timeoutMs?: number;
  /** Optional fetch init (method, headers, body, etc.). */
  init?: RequestInit;
}

/**
 * Fetches a URL and returns the response body as parsed JSON.
 * Uses AbortController to abort the request after timeoutMs.
 * Throws FetchTimeoutError when the timeout is reached.
 */
export async function fetchJsonWithTimeout<T = unknown>(
  url: string,
  options: FetchJsonWithTimeoutOptions = {}
): Promise<T> {
  const { timeoutMs, init = {} } = options;
  const controller = new AbortController();
  const signal = controller.signal;

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  if (timeoutMs != null && timeoutMs > 0) {
    timeoutId = setTimeout(() => {
      controller.abort();
    }, timeoutMs);
  }

  try {
    const response = await fetch(url, { ...init, signal });
    if (timeoutId != null) clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return (await response.json()) as T;
  } catch (err) {
    if (timeoutId != null) clearTimeout(timeoutId);
    if (err instanceof Error && err.name === "AbortError") {
      throw new FetchTimeoutError(
        `Request timed out after ${timeoutMs}ms`,
        timeoutMs
      );
    }
    throw err;
  }
}
