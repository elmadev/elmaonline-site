import { merge } from 'lodash';

/** * Queries ** */
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
  schema as GetRanking,
  queries as GetRankingQueries,
  resolvers as GetRankingResolver,
} from './ranking/GetRanking';

import {
  schema as GetBattletime,
  queries as GetBattletimeQueries,
  resolvers as GetBattletimeResolver,
} from './battle/GetBattletime';

import {
  schema as GetBesttime,
  queries as GetBesttimeQueries,
  resolvers as GetBesttimeResolver,
} from './time/GetBesttime';

import {
  schema as GetChatLines,
  queries as GetChatLinesQueries,
  resolvers as GetChatLinesResolver,
} from './chat/GetChatLines';

/** * Mutations ** */

import {
  schema as InsertReplay,
  mutation as InsertReplayMutation,
  resolvers as InsertReplayResolver,
} from './replay/InsertReplays';

import {
  schema as GetTimes,
  queries as GetTimesQueries,
  resolvers as GetTimesResolver,
} from './time/GetTimes';

import {
  schema as GetLevelPacks,
  queries as GetLevelPacksQueries,
  resolvers as GetLevelPacksResolver,
} from './levelpack/LevelPack';

import {
  queries as SearchQueries,
  resolvers as SearchResolver,
} from './search/Search';

export const schema = [
  ...GetBattles, // export the schema object here
  ...GetReplays,
  ...GetLevels,
  ...GetKuskis,
  ...GetBattletime,
  ...GetBesttime,
  ...GetChatLines,
  ...InsertReplay,
  ...GetRanking,
  ...GetTimes,
  ...GetLevelPacks,
];

export const queries = [
  ...GetBattlesQueries, // export the query object here
  ...GetReplaysQueries,
  ...GetLevelsQueries,
  ...GetKuskisQueries,
  ...GetBattletimeQueries,
  ...GetBesttimeQueries,
  ...GetChatLinesQueries,
  ...GetTimesQueries,
  ...GetLevelPacksQueries,
  ...GetRankingQueries,
  ...SearchQueries,
];

export const mutations = [...InsertReplayMutation];

export const resolvers = merge(
  GetBattlesResolver, // export the resolver object here
  GetReplaysResolver,
  GetLevelsResolver,
  GetKuskisResolver,
  GetBattletimeResolver,
  GetBesttimeResolver,
  GetChatLinesResolver,
  InsertReplayResolver,
  GetRankingResolver,
  GetTimesResolver,
  GetLevelPacksResolver,
  SearchResolver,
);
