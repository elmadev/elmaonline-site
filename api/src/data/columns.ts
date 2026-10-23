import type { Model } from 'sequelize';

// the datetime columns are stored as 'YYYY-MM-DD HH:mm:ss' strings (or Dates,
// depending on the driver), and sent to clients as unix seconds. Empty and
// invalid dates, ie. '0000-00-00 00:00:00', are 0
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

// getter for a datetime column, spread into its definition. The stored value
// is still what where clauses, dataValues and raw queries see
export const unixSeconds = (column: string) => ({
  get(this: Model): number {
    return toUnixSeconds(this.getDataValue(column));
  },
});
