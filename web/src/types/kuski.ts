export type TeamData = {
  TeamIndex?: number;
  Team: string;
  Logo?: string | null;
};

export type KuskiData = {
  KuskiIndex?: number;
  Kuski: string;
  Country?: string;
  TeamIndex?: number;
  TeamData?: TeamData | null;
  BmpCRC?: number;
};
