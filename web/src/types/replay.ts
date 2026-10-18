import type { KuskiData } from 'types/kuski';
import type { LevelData } from 'types/level';
import type { Tag } from 'types/tag';

export type Replay = {
  ReplayIndex: number;
  UUID: string;
  RecFileName: string;
  LevelIndex: number;
  TimeIndex?: number;
  ReplayTime: number;
  /** unix timestamp */
  Uploaded: number;
  UploadedBy?: number;
  DrivenBy?: number;
  DrivenByText?: string;
  DrivenByData?: KuskiData | null;
  UploadedByData?: KuskiData | null;
  LevelData?: LevelData | null;
  Tags: Tag[];
  Comment?: string;
  Unlisted?: number;
  Views?: number;
  ratingAvg?: number;
  /** set on battle replays */
  BattleIndex?: number;
  Apples?: number;
};
