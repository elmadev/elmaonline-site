import type { Tag } from './tag.ts';

export type LGR = {
  LGRIndex: number;
  LGRName: string;
  LGRDesc: string;
  PreviewLink: string;
  Downloads: number;
  /** unix timestamp */
  Added: number;
  Tags: Tag[];
};
