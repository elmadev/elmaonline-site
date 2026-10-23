import type { KuskiData } from './kuski.ts';

export type LevelData = {
  LevelIndex: number;
  LevelName: string;
  LongName?: string;
  /** unix timestamp in seconds, 0 when unknown */
  Added?: number;
  Hidden?: number;
  KuskiData?: KuskiData | null;
};
