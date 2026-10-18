import type { KuskiData } from 'types/kuski';
import type { LevelData } from 'types/level';

export type Battle = {
  BattleIndex: number;
  LevelIndex: number;
  BattleType: string;
  /** unix timestamp, as a string */
  Started: string;
  /** minutes */
  Duration: number;
  /** seconds */
  Countdown: number;
  KuskiData?: KuskiData | null;
  LevelData?: LevelData | null;
};
