/** Body of any error response. */
export type ApiError = { error: string };

/** Outcome of a mutation. Same wire format the API already uses. */
export type ApiResult<T extends object = Record<never, never>> =
  | ({ success: 1 } & T)
  | { success: 0; error: string };
