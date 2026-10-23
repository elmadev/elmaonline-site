import type { ApiError, Id, ListQuery } from './endpoint.ts';
import type { KuskiData } from './kuski.ts';
import type { LevelData } from './level.ts';
import type { Tag } from './tag.ts';

/** the public columns of a replay */
export type ReplayRow = {
  ReplayIndex: number;
  /** 0 when the driver is unknown, see DrivenByText */
  DrivenBy: number | null;
  DrivenByText: string | null;
  UploadedBy: number;
  LevelIndex: number;
  TimeIndex: number | null;
  /** hundredths of a second */
  ReplayTime: number | null;
  /** 1 when the run was finished */
  Finished: number | null;
  /** unix timestamp in seconds */
  Uploaded: number;
  Unlisted: number;
  Hide: number;
  TAS: number;
  Bug: number;
  Nitro: number;
  Comment: string | null;
  UUID: string | null;
  RecFileName: string | null;
  Views: number;
};

/**
 * A replay as the api returns it: the columns, plus whichever associations
 * the endpoint includes. Battle, cup and time file replays are built from
 * other tables and have no ReplayIndex (0), but the same shape.
 */
export type ReplayData = ReplayRow & {
  Tags?: Tag[];
  LevelData?: (Pick<LevelData, 'LevelName'> & Partial<LevelData>) | null;
  UploadedByData?: KuskiData | null;
  DrivenByData?: KuskiData | null;
  /** a DECIMAL, which the db driver returns as a string. List endpoints only */
  ratingAvg?: string | null;
  ratingCnt?: number;
  /** set on battle and time file replays */
  BattleIndex?: number;
  /** set on cup replays */
  CupTimeIndex?: number;
  /** set on battle replays */
  Apples?: number;
};

export type ReplayListQuery = ListQuery & {
  /** only replays of this level */
  level?: Id;
};

/** a replay uploaded through the site */
export type InsertReplayBody = {
  UUID: string;
  RecFileName: string;
  Uploaded: number;
  ReplayTime: number;
  Finished: number;
  LevelIndex: number;
  Unlisted: number;
  Hide: number;
  /** 0 when the driver isn't a user, see DrivenByText */
  DrivenBy: number;
  DrivenByText: string;
  TAS: number;
  Bug: number;
  Nitro: number;
  Comment: string;
  MD5: string;
  Tags: Pick<Tag, 'TagIndex' | 'Hidden'>[];
};

export type UpdateReplayResult =
  | {
      success: 1;
      ReplayIndex: number;
      UUID: string | null;
      RecFileName: string | null;
      Unlisted: number;
    }
  | { success: 0; error: string };

/** a time file of the user's own, published as a replay */
export type ShareReplayBody = {
  TimeIndex: number;
  TimeFileData: {
    TimeFileIndex: number;
    TimeIndex: number;
    UUID: string;
    MD5: string;
  };
  LevelData: Pick<LevelData, 'LevelName'>;
  Unlisted: boolean | number;
  Hide: boolean | number;
  Comment: string;
  Tags: Pick<Tag, 'TagIndex' | 'Hidden'>[];
};

export type ShareReplayResult = { success: 1 } | { success: 0; error: string };

export type EditReplayBody = {
  ReplayUuid: string;
  /** without the .rec extension */
  RecFileName: string;
  edit: {
    Comment: string | null;
    Unlisted: number;
    /** the name of a user, or free text when there is no such user */
    DrivenBy: string;
    Tags: Pick<Tag, 'TagIndex' | 'Hidden'>[];
  };
};

/**
 * One uuid gives a replay (null when there is none), uuids joined with ';'
 * give an array in the same order, null for the ones that weren't found.
 */
export type ReplayByUUIDResult = ReplayData | null | (ReplayData | null)[];

export interface ReplayEndpoints {
  'GET /replay': { query: ReplayListQuery; res: ReplayData[] };
  'GET /replay/my': { query: ReplayListQuery; res: ReplayData[] };
  'GET /replay/random': { query: { limit?: number }; res: ReplayData[] };
  'GET /replay/driven_by/:KuskiIndex': {
    query: ReplayListQuery;
    res: ReplayData[];
  };
  'GET /replay/uploaded_by/:KuskiIndex': {
    query: ReplayListQuery;
    res: ReplayData[];
  };
  'GET /replay/byUUID/:UUID': {
    /** fingerprint of the browser, to count views once per day */
    query: { f?: string };
    res: ReplayByUUIDResult;
  };
  'GET /replay/byLevelIndex/:LevelIndex': { res: ReplayData[] };
  'GET /replay/search/byDriven/:query/:offset': { res: ReplayData[] };
  'GET /replay/search/byLevel/:query/:offset': { res: ReplayData[] };
  'GET /replay/search/byFilename/:query/:offset': { res: ReplayData[] };
  'GET /replay/:ReplayIndex': { res: ReplayData[] };
  'POST /replay': { body: InsertReplayBody; res: ReplayData | ApiError };
  'POST /replay/update': {
    body: { ReplayIndex: number };
    res: UpdateReplayResult;
  };
  'POST /replay/share': { body: ShareReplayBody; res: ShareReplayResult };
  /** the status text, ie. 'OK' */
  'POST /replay/edit': { body: EditReplayBody; res: string };
}
