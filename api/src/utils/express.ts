import type { Request, Response } from 'express';
import type { ApiError } from '#contract/response.ts';

// req.query values are always strings, the parse helpers in #utils/query.ts
// turn them into numbers
export type RawQuery<T> = { [K in keyof T]?: string | string[] };

export type Req<
  Body = unknown,
  Query = unknown,
  Params = Request['params'],
> = Request<Params, unknown, Body, Query>;

export type Res<T = unknown> = Response<T | ApiError>;
