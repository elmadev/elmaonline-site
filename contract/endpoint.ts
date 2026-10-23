// Type-only helpers shared by the endpoint maps in each area's file. An area
// declares its endpoints as an interface keyed by 'METHOD /path', ie.
//
//   export interface CountryEndpoints {
//     'GET /country': { res: CountryData[] };
//   }
//
// Route params are never written out, they're derived from the path.

/** ids are sent as numbers or numeric strings (ie. from route params) */
export type Id = number | string;

export type Endpoint = {
  /** query string, as sent by the client */
  query?: object;
  body?: object;
  res: unknown;
};

type ParamNames<Path extends string> =
  Path extends `${string}:${infer Name}/${infer Rest}`
    ? Name | ParamNames<`/${Rest}`>
    : Path extends `${string}:${infer Name}`
      ? Name
      : never;

/** route params of a path, ie. PathParams<'/replay/:UUID'> is { UUID: Id } */
export type PathParams<Path extends string> = {
  [Name in ParamNames<Path>]: Id;
};

/** body of most failed requests */
export type ApiError = { error: string };

/** query of the paginated list endpoints */
export type ListQuery = {
  page: number;
  pageSize: number;
  tags?: Id[];
  excludedTags?: Id[];
  sortBy?: string;
  order?: string;
  levelPack?: Id;
};
