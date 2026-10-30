export type SiteCupTimeRow = {
  CupTimeIndex: number;
  CupIndex: number;
  KuskiIndex: number;
  TimeIndex: number;
  Time: number;
  TimeExists: number;
  RecData: Uint8Array | null;
  Replay: number;
  Code: string;
  ShareReplay: number;
  Comment: string;
  TeamIndex: number;
  UUID: string | null;
  MD5: string | null;
  Views: number;
};
