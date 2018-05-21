import { merge } from 'lodash';

/** * Queries ** */
import {
  schema as GetAllUsers,
  queries as GetAllUsersQueries,
  resolvers as GetAllUsersResolver,
} from './users/GetAllUsers';

// imports from the queries we built,
// 3 or 4 depending on wether you have queries, mutations or both
// use as and a unique variable name, as there will be many of those in this file
import {
  schema as GetBattles,
  queries as GetBattlesQueries,
  resolvers as GetBattlesResolver,
} from './battle/GetBattles';

import {
  schema as GetReplays,
  queries as GetReplaysQueries,
  resolvers as GetReplaysResolver,
} from './replay/GetReplays';

import {
  schema as GetLevels,
  queries as GetLevelsQueries,
  resolvers as GetLevelsResolver,
} from './level/GetLevels';

import {
  schema as GetKuskis,
  queries as GetKuskisQueries,
  resolvers as GetKuskisResolver,
} from './kuski/GetKuskis';

import {
  schema as GetBattletime,
  queries as GetBattletimeQueries,
  resolvers as GetBattletimeResolver,
} from './battle/GetBattletime';

import {
  queries as GetLoggedInUserQueries,
  resolvers as GetLoggedInUserResolver,
} from './users/GetLoggedInUser';

/** * Mutations ** */
import {
  schema as CreateUserInput,
  mutation as CreateUser,
  resolvers as CreateUserResolver,
} from './users/CreateUser';

export const schema = [
  ...GetAllUsers,
  ...CreateUserInput,
  ...GetBattles, // export the schema object here
  ...GetReplays,
  ...GetLevels,
  ...GetKuskis,
  ...GetBattletime,
];

export const queries = [
  ...GetAllUsersQueries,
  ...GetLoggedInUserQueries,
  ...GetBattlesQueries, // export the query object here
  ...GetReplaysQueries,
  ...GetLevelsQueries,
  ...GetKuskisQueries,
  ...GetBattletimeQueries,
];

export const mutations = [...CreateUser];

export const resolvers = merge(
  GetAllUsersResolver,
  GetLoggedInUserResolver,
  CreateUserResolver,
  GetBattlesResolver, // export the resolver object here
  GetReplaysResolver,
  GetLevelsResolver,
  GetKuskisResolver,
  GetBattletimeResolver,
);
