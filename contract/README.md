# contract

Types shared by `api` and `web` that describe what goes over the wire. Types
only, no runtime code, and nothing from Sequelize, so `web` can import them.
Import from the file that defines the type, there is no index file.

One file per entity (`replay.ts`), plus `response.ts` for the generic response
types.

## Naming

Entity first, then what the type is.

| Role                          | Pattern                    | Example               |
| ----------------------------- | -------------------------- | --------------------- |
| Database table row            | `<Entity>Row`              | `ReplayRow`           |
| Item returned by a GET        | `<Entity>Item`             | `ReplayItem`          |
| Part of an item or body       | `<Entity><Part>`           | `ReplayKuski`         |
| POST create body              | `<Entity>CreateBody`       | `ReplayCreateBody`    |
| POST update body              | `<Entity>UpdateBody`       | `ReplayUpdateBody`    |
| POST body for another action  | `<Entity><Action>Body`     | `ReplayShareBody`     |
| GET query string              | `<Entity>ListQuery`        | `ReplayListQuery`     |
| Response that is not the item | `<Entity><Action>Response` | `ReplayShareResponse` |

- `Body` is `req.body`. Query string and route params are separate types.
- Name the type after what the endpoint does, not after the function that
  handles it.
- The row type is the source of truth. Derive the others from it with `Pick`,
  `Omit` and `Partial`, so a column change shows up everywhere.
- Types for data after the server has parsed or enriched it, like the filter
  built from a `ReplayListQuery`, stay in `api`.
- Fields the server adds itself (like `KuskiIndex` from the login) are not part
  of a body type. Add them where the handler is typed instead, for example
  `ReplayUpdateBody & { KuskiIndex: number }`.

## Responses

`response.ts` has two generics that match what the API already sends:

- `ApiError` is `{ error: string }`, the body of an error response.
- `ApiResult<T>` is the outcome of a mutation: `{ success: 1 } & T` or
  `{ success: 0; error: string }`. Narrow it with `res.success`.

GET endpoints return the bare data on success and `ApiError` on failure, so
the type is `ReplayItem[] | ApiError`. Narrow it with `'error' in res`.
Endpoints that only send a status code are typed as the status union,
like `Promise<200 | 401 | 404>`.
