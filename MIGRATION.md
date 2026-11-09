# Converting a page

How to move one area (eg. replays, levels, battles) to TypeScript on both sides and from easy-peasy to TanStack Query. Do one area per PR. The replay area is the reference: `contract/replay.ts`, `api/src/api/replay.ts` and the replay functions in `web/src/api.ts`.

## 1. Contract (`contract/<entity>.ts`)

- Add the `<Entity>Row` for each table the area returns, with every public column and its real nullability. Private columns (passwords, emails) stay out.
- Derive the response, body and query types from the row with `Pick`/`Omit`, following the naming in [contract/README.md](contract/README.md).
- Use `ApiError` / `ApiResult` from `contract/response.ts` for errors and mutations.
- If the area's types already exist in `web/src/types/`, move them here, update the imports and delete the old file. No re-export files.
- Types only. Nothing is imported from outside `contract/`, and other contract files are imported with `./x.ts`.

## 2. Api models (`api/src/data/models/`)

- Before converting, add edge cases for the area to `api/compare/manual.txt` (bad ids, odd query strings).
- `git mv X.js X.ts`, then type it with `ModelInstance<XRow>` from `api/src/data/columns.ts`. Add private columns to the row type in the model file, not the contract.
- Datetime getters use `unixSeconds(column)` from `columns.ts`, so they always return a number.
- `allowNull` matches the contract's nullability, and `defaultValue: null` replaces `DataType.NULL`.

## 3. Api route (`api/src/api/<area>.ts`)

- `git mv <area>.js <area>.ts`.
- Type each handler with `Req<Body, Query>` / `Res<T>` from `#utils/express.ts`, where `T` is the contract type. Error responses are part of the type, don't cast.
- Parse every query string and route param with `queryInt`, `queryIntList` and `queryString` from `#utils/query.ts`. Never put raw input in `sequelize.literal`.
- Build `create`/`update` data from named body fields, not by spreading `req.body`.
- Keep the explicit `attributes:` lists, since the types don't stop extra fields like `Email` from leaking.
- Import contract types with `import type` from `#contract/<entity>.ts`.
- Imports of other files use the real extension: `.ts` for converted files, `.js` for the rest. Update every importer of a renamed file.

## 4. Check the api

Run these from `api/`:

- `yarn typecheck && yarn importscheck && yarn lint`.
- `TZ=UTC yarn start`, then `yarn compare --area <area>` against apitest.
- For SQL and writes, use a local baseline: `yarn compare:baseline`, `COMPARE=1 TZ=UTC yarn start`, then `yarn compare --baseline http://localhost:3004 --sql --writes --area <area>`. See [api/compare/README.md](api/compare/README.md).
- Fix every difference, or add it to `api/compare/accepted.ts` once you've checked that web handles it.

## 5. Web api functions (`web/src/api.ts`)

- Type the area's functions: typed parameters instead of `Untyped`, and the response through apisauce's generic, `api.get<XItem[], ApiError>(...)`.
- Import the types with `import type` from `contract/<entity>.ts`.

## 6. Web page: easy-peasy → TanStack Query

- Replace the store's thunks with queries: `useQueryAlt(key, () => Fn(...))` for reads, or `useQuery`/`useMutation` with `apiData(Fn(...))` (see `web/src/features/Messages/useMessages.ts`).
- Mutations refresh data with `queryClient.invalidateQueries`, not by writing to a store.
- Put the query keys in one place per feature.
- Move UI-only state (open dialogs, filters) to `useState` or the URL, or keep the store file where it makes sense, but then it needs to be typed.
- Delete the `store.js` once nothing uses it, and remove it from `web/src/easypeasy.js`.
- Rename the page and its components `.jsx` → `.tsx`, and type their props.
- Import from the file that defines a thing. No `index.ts` barrel files.

## 7. Check the web

Run these from `web/`:

- `yarn typecheck && yarn lint`.
- `yarn start` at the repo root, then click through the page, logged in and logged out.
- `yarn test:e2e`. If request URLs changed, run `yarn test:e2e:update`.
