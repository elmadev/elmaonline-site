import sequelize from '../data/sequelize';

// get the first row of a select query, or a default value.
export const getOne = async (sql, opts, df = null) => {
  const [results] = await sequelize.query(sql, opts || {});

  return results.length > 0 ? results[0] : df;
};

// get a specified column in the first row of a query.
// if the query returns no rows or your column is not found,
// returns undefined. In some cases, undefined indicates an
// error on your part.
export const getCol = async (sql, opts, column) => {
  const first = await getOne(sql, opts, null);

  return first ? first[column] : undefined;
};

/**
 * You can call this inside a method on a sequelize instance, and
 * pass the instance as the first parameter.
 *
 * It gets the column, JSON parses it, calls your callable on that
 * object/array, updates the instance, and then optionally calls
 * save on the instance.
 *
 * @param self
 * @param col
 * @param callable
 * @param save
 * @param df
 * @returns {any}
 * @constructor
 */
export const JsonUpdate = (self, col, callable, save, df = {}) => {
  // bypass get/set methods in model definition, if any
  const stringVal = self.dataValues[col];
  let value = stringVal ? JSON.parse(stringVal) : df;

  const ret = callable(value);

  // allow callable to mutate and/or return
  if (ret !== undefined) {
    value = ret;
  }

  // eslint-disable-next-line no-param-reassign
  self.dataValues[col] = JSON.stringify(value);

  if (save) {
    self.save();
  }

  return value;
};

export const jsonAccessors = (col, df = {}) => ({
  get() {
    const v = this.getDataValue(col);
    return v ? JSON.parse(v) : df;
  },
  set(arr) {
    this.setDataValue(col, JSON.stringify(arr));
  },
});
