export type LevelRow = {
  LevelIndex: number;
  LevelName: string;
  CRC: number;
  LongName: string | null;
  Apples: number | null;
  Killers: number | null;
  Flowers: number | null;
  LevelData: Uint8Array | null;
  Locked: number;
  HardLocked: number;
  Hidden: number;
  Legacy: number;
  ForceHide: number;
  AcceptBugs: number;
  Added: number;
};
