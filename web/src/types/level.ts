import type { KuskiData } from 'types/kuski';

export type LevelData = {
  LevelIndex: number;
  LevelName: string;
  LongName?: string;
  /** unix timestamp */
  Added?: number;
  Hidden?: number;
  KuskiData?: KuskiData | null;
};
