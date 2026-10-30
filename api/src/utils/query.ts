export const queryString = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined;

export const queryInt = (value: unknown): number | undefined =>
  typeof value === 'string' && /^-?\d+$/.test(value)
    ? Number.parseInt(value, 10)
    : undefined;

export const queryIntList = (value: unknown): number[] =>
  (Array.isArray(value) ? value : [value])
    .map(queryInt)
    .filter(item => item !== undefined);
