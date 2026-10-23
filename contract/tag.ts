export type Tag = {
  TagIndex: number;
  Name: string;
  /** 1 for tags that users can't add or remove */
  Hidden: number;
  Type: 'replay' | 'level' | 'levelpack' | 'lgr';
};
