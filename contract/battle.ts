import type { KuskiData } from './kuski.ts';
import type { LevelData } from './level.ts';

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
