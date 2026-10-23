// Parsers for query strings and route params. express types them as
// `string | string[] | ParsedQs | ...`, and they come straight from the client,
// so anything that isn't the expected shape is dropped

export const queryString = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined;

export const queryInt = (value: unknown): number | undefined =>
  typeof value === 'string' && /^-?\d+$/.test(value)
    ? Number.parseInt(value, 10)
    : undefined;

// `?tags[]=1&tags[]=2` gives [1, 2] and `?tags=1` gives [1]
export const queryIntList = (value: unknown): number[] =>
  (Array.isArray(value) ? value : [value])
    .map(queryInt)
    .filter(item => item !== undefined);
