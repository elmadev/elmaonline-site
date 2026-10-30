import type { Model } from 'sequelize';

// Sequelize defines an accessor per column, so the row type is mixed into the
// instance to allow `replay.ReplayIndex`. Extras is for association mixins.
export type ModelInstance<
  Row extends object,
  Extras extends object = object,
> = Model<Row, Partial<Row>> & Row & Extras;

export const toUnixSeconds = (value: unknown): number => {
  if (
    !(value instanceof Date) &&
    typeof value !== 'string' &&
    typeof value !== 'number'
  ) {
    return 0;
  }
  const ms = new Date(value).getTime();
  return Number.isNaN(ms) ? 0 : Math.floor(ms / 1000);
};

export const unixSeconds = (column: string) => ({
  get(this: Model): number {
    return toUnixSeconds(this.getDataValue(column));
  },
});
