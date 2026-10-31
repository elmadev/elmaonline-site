import type { KuskiRow } from './kuski.ts';
import type { LevelRow } from './level.ts';
import type { ReplayRatingRow } from './replayrating.ts';
import type { ApiError, ApiResult } from './response.ts';
import type { TagRow } from './tag.ts';

export type ReplayRow = {
  ReplayIndex: number;
  DrivenBy: number | null;
  DrivenByText: string | null;
  UploadedBy: number;
  LevelIndex: number;
  TimeIndex: number | null;
  ReplayTime: number | null;
  Finished: number | null;
  Uploaded: number;
  Unlisted: number;
  Hide: number;
  TAS: number;
  Bug: number;
  Nitro: number;
  Comment: string | null;
  UUID: string | null;
  RecFileName: string | null;
  MD5: string | null;
  Views: number;
};

// the kuski and level columns the replay queries select on their includes
export type ReplayKuski = Pick<KuskiRow, 'Kuski' | 'Country'> &
  Partial<Pick<KuskiRow, 'KuskiIndex' | 'BmpCRC' | 'TeamIndex'>>;

export type ReplayLevel = Pick<LevelRow, 'LevelName'> &
  Partial<Pick<LevelRow, 'LevelIndex'>>;

/**
 * A replay as returned by the replay endpoints. Unlike ReplayRow it also
 * covers battle, cup and timefile replays, which are built from other tables,
 * and the includes are only set on the endpoints that load them.
 */
export type ReplayItem = Omit<ReplayRow, 'Unlisted' | 'Hide' | 'MD5'> &
  Partial<Pick<ReplayRow, 'Unlisted' | 'Hide' | 'MD5'>> & {
    /** set on battle and timefile replays */
    BattleIndex?: number;
    /** set on cup replays */
    CupTimeIndex?: number;
    /** set on battle replays */
    Apples?: number;
    LevelData?: ReplayLevel | null;
    UploadedByData?: ReplayKuski | null;
    DrivenByData?: ReplayKuski | null;
    Tags?: TagRow[];
    Rating?: ReplayRatingRow[];
    ratingAvg?: number | null;
    ratingCnt?: number;
  };

/**
 * The query string of GET /replay and the other replay list endpoints. The
 * server turns it into its own filter, with an offset and limit instead of
 * page and pageSize.
 */
export type ReplayListQuery = {
  page?: number;
  pageSize?: number;
  /** only replays that have all of these tags */
  tags?: number[];
  /** only replays that have none of these tags */
  excludedTags?: number[];
  sortBy?: 'uploaded' | 'rating' | 'views' | 'time';
  order?: 'asc' | 'desc';
  /** LevelPackIndex */
  levelPack?: number;
  /** LevelIndex, overrides levelPack */
  level?: number;
};

/**
 * GET /replay/byUUID/:UUID. One replay for a single UUID, or one entry per
 * UUID (null when not found) when several are joined with `;` to merge them
 */
export type ReplayByUUIDResponse = ReplayItem | (ReplayItem | null)[] | null;

// the tag columns the replay endpoints read from the client
export type ReplayTag = Pick<TagRow, 'TagIndex' | 'Hidden'>;

/**
 * The body of POST /replay
 */
export type ReplayCreateBody = Pick<
  ReplayRow,
  | 'UUID'
  | 'RecFileName'
  | 'MD5'
  | 'Uploaded'
  | 'ReplayTime'
  | 'Finished'
  | 'LevelIndex'
  | 'DrivenBy'
  | 'Unlisted'
  | 'Hide'
  | 'Comment'
  | 'UploadedBy'
> &
  Partial<
    Pick<ReplayRow, 'DrivenByText' | 'TimeIndex' | 'TAS' | 'Bug' | 'Nitro'>
  > & {
    Tags: ReplayTag[];
  };

/**
 * POST /replay answers a duplicate upload with an error body and status 200
 */
export type ReplayCreateResponse = ReplayItem | ApiError;

export type ReplayShareBody = {
  TimeIndex: number;
  TimeFileData: {
    TimeFileIndex: number;
    TimeIndex: number;
    UUID: string;
    MD5: string;
  };
  LevelData: Pick<ReplayLevel, 'LevelName'>;
  Unlisted: boolean | number;
  Hide: boolean | number;
  Comment: string;
  Tags: ReplayTag[];
};

/**
 * The body of POST /replay/edit
 */
export type ReplayUpdateBody = {
  ReplayUuid: string;
  /** without the .rec extension */
  RecFileName: string;
  edit: Pick<ReplayRow, 'Comment' | 'Unlisted'> & {
    /** a kuski name, or free text when there is no such kuski */
    DrivenBy: string | null;
    Tags: ReplayTag[];
  };
};

/**
 * The body of POST /replay/update, which makes an unlisted replay public
 */
export type ReplayPublishBody = Pick<ReplayRow, 'ReplayIndex'>;

export type ReplayPublishResponse = ApiResult<
  Pick<ReplayRow, 'ReplayIndex' | 'UUID' | 'RecFileName' | 'Unlisted'>
>;

export type ReplayShareResponse = ApiResult;
