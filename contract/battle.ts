export type BattleRow = {
  BattleIndex: number;
  KuskiIndex: number;
  LevelIndex: number;
  BattleType: string;
  SeeOthers: number;
  SeeTimes: number;
  AllowStarter: number;
  AcceptBugs: number;
  NoVolt: number;
  NoTurn: number;
  OneTurn: number;
  NoBrake: number;
  NoThrottle: number;
  Drunk: number;
  OneWheel: number;
  Multi: number;
  // unix seconds (string, or 0 when not started), converted by the model getter
  Started: string | number;
  StartedUtc: string | number;
  Duration: number;
  Aborted: number;
  Finished: number;
  InQueue: number;
  Countdown: number;
  RecFileName: string | null;
  RecData: Uint8Array | null;
  Views: number;
};
