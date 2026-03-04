import type { ZodType } from "zod";

/**
 * Vidar Typed Fetch Wrapper
 *
 * PURPOSE
 * Standardised, fully-typed API request layer with mandatory runtime validation.
 *
 * RULES
 * - UI components must never call fetch() directly.
 * - All API calls must pass through fetchJSON() or the helpers below.
 * - Every response must be validated with a Zod schema before use.
 * - The JWT token must be injected via setAuthToken() after OIDC login.
 *
 * EXPORTED HELPERS (use these in query/mutation files — not fetchJSON directly)
 * - createQueryFn()    → produces a TanStack Query-compatible queryFn
 * - createMutationFn() → produces a TanStack Query-compatible mutationFn
 * - mutateJSON()       → low-level mutation, used by createMutationFn internally
 *
 * DATA FLOW (enforced — do not bypass)
 * Backend API → fetcher.ts → Zod validation → TanStack Query → UI component
 *
 * AI NOTE
 * Never import fetch() in components or query files.
 * Never skip schema.parse() on API responses.
 * Never store the token outside of the module-level variable below.
 * Never use optimistic updates for governance mutations — the backend is
 * authoritative on all state transitions. Always wait for the confirmed
 * response, then invalidate the relevant query cache keys.
 */

// ---------------------------------------------------------------------------
// Auth token — injected after OIDC login, never persisted to localStorage
// ---------------------------------------------------------------------------

let _authToken: string | null = null;

/** Call this once after OIDC login resolves. */
export function setAuthToken(token: string): void {
  _authToken = token;
}

/** Call this on logout. */
export function clearAuthToken(): void {
  _authToken = null;
}

// ---------------------------------------------------------------------------
// Core fetch wrapper
// ---------------------------------------------------------------------------

/** Default request timeout in milliseconds. Override per-call via timeoutMs. */
const DEFAULT_TIMEOUT_MS = 15_000;

export interface FetchOptions extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
  /**
   * Request timeout in milliseconds.
   * Defaults to 15000 (15s). Pass 0 to disable.
   */
  timeoutMs?: number;
}

/**
 * Fetches a JSON endpoint and validates the response against a Zod schema.
 *
 * @param url     - Absolute or relative path, e.g. `/api/internal/systems`
 * @param schema  - Zod schema matching the expected response shape
 * @param options - Optional overrides including timeoutMs and signal
 * @returns       Parsed and validated response typed as T
 * @throws        ApiError on non-2xx status
 * @throws        ZodError on schema mismatch
 * @throws        DOMException (AbortError) on timeout or external cancellation
 */
export async function fetchJSON<T>(
  url: string,
  schema: ZodType<T>,
  options: FetchOptions = {}
): Promise<T> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, signal: externalSignal, ...restOptions } = options;

  // Combine timeout with any external AbortSignal (e.g. from TanStack Query)
  const timeoutController = new AbortController();
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  if (timeoutMs > 0) {
    timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);
  }

  if (externalSignal?.aborted) {
    timeoutController.abort();
  } else {
    externalSignal?.addEventListener("abort", () => timeoutController.abort());
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(restOptions.headers ?? {}),
  };

  if (_authToken) {
    headers["Authorization"] = `Bearer ${_authToken}`;
  }

  try {
    const res = await fetch(url, {
      credentials: "include",
      ...restOptions,
      headers,
      signal: timeoutController.signal,
    });

    if (!res.ok) {
      let body: unknown;
      try {
        body = await res.json();
      } catch {
        body = { message: res.statusText };
      }
      throw new ApiError(res.status, body);
    }

    const json: unknown = await res.json();
    return schema.parse(json);
  } finally {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  }
}

// ---------------------------------------------------------------------------
// Mutation helper (POST / PATCH / DELETE)
// ---------------------------------------------------------------------------

/**
 * Sends a mutation request and validates the response.
 *
 * @param url    - Endpoint path
 * @param method - HTTP method
 * @param body   - Request payload (JSON-serialised). Pass undefined for DELETE with no body.
 * @param schema - Zod schema for the response
 *
 * AI NOTE
 * Do not apply optimistic updates after calling mutateJSON.
 * Governance state transitions are backend-authoritative.
 * After a successful mutation, invalidate the relevant TanStack Query
 * cache keys so the UI re-fetches confirmed state from the backend.
 *
 * Correct pattern:
 *   onSuccess: () => queryClient.invalidateQueries({ queryKey: ['amendments'] })
 *
 * Incorrect pattern:
 *   onMutate: () => { update local cache with assumed new state }
 */
export async function mutateJSON<TResponse>(
  url: string,
  method: "POST" | "PATCH" | "DELETE",
  body: unknown,
  schema: ZodType<TResponse>
): Promise<TResponse> {
  return fetchJSON(url, schema, {
    method,
    // DELETE requests typically carry no body — skip serialisation if undefined
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
}

// ---------------------------------------------------------------------------
// TanStack Query helpers
// ---------------------------------------------------------------------------

/**
 * Returns a queryFn compatible with TanStack Query's createQuery.
 *
 * Passes TanStack Query's AbortSignal through to fetch so queries
 * cancelled by TanStack (component unmount, query key change) are
 * also cancelled at the network level.
 *
 * Usage:
 *   queryFn: createQueryFn(`/api/internal/systems`, PaginatedSystemsSchema)
 */
export function createQueryFn<T>(
  url: string,
  schema: ZodType<T>
): (context: { signal?: AbortSignal }) => Promise<T> {
  return ({ signal } = {}) => fetchJSON(url, schema, { signal });
}

/**
 * Returns a mutationFn compatible with TanStack Query's createMutation.
 *
 * Binds the URL, HTTP method, and response schema once so mutation files
 * do not repeat them on every call. The returned function accepts the
 * request body and returns the validated response.
 *
 * Usage:
 *   mutationFn: createMutationFn<CreateAmendmentRequest, ApiAmendment>(
 *     `/api/internal/amendments`,
 *     "POST",
 *     SingleAmendmentSchema
 *   )
 *
 * AI NOTE
 * Always pair with onSuccess cache invalidation — never onMutate optimistic updates.
 */
export function createMutationFn<TRequest, TResponse>(
  url: string,
  method: "POST" | "PATCH" | "DELETE",
  schema: ZodType<TResponse>
): (body: TRequest) => Promise<TResponse> {
  return (body: TRequest) => mutateJSON(url, method, body, schema);
}

// ---------------------------------------------------------------------------
// Error class
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown
  ) {
    super(`API error ${status}: ${JSON.stringify(body)}`);
    this.name = "ApiError";
  }
}
