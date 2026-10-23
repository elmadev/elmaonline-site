import type { KuskiData, TeamData } from './kuski.ts';
import type { LevelData } from './level.ts';

export type Cup = {
  CupGroupIndex: number;
  CupName: string;
  ShortName: string;
  TeamPoints: number;
};

export type CupEvent = {
  CupIndex: number;
  LevelIndex: number;
  /** unix timestamp, as a string */
  StartTime: string;
  /** unix timestamp, as a string */
  EndTime: string;
  KuskiData?: KuskiData | null;
  Level?: LevelData | null;
};

export type CupResult = {
  KuskiIndex: number;
  CupTimeIndex: number;
  Time: number;
  Points: number;
  Position?: number;
  Replay?: number;
  UUID?: string;
  KuskiData: KuskiData;
  TeamData?: TeamData | null;
};
