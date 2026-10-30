export type TimeRow = {
  TimeIndex: number;
  KuskiIndex: number;
  LevelIndex: number;
  Time: number;
  Apples: number;
  // unix seconds as a string, converted by the model getter
  Driven: string;
  Finished: string;
  BattleIndex: number;
  '24httIndex': number;
  MaxSpeed: number;
  ThrottleTime: number;
  BrakeTime: number;
  LeftVolt: number;
  RightVolt: number;
  SuperVolt: number;
  Turn: number;
  OneWheel: number;
  FPSLimit: number;
};
