import { checkSchema, validationResult } from 'express-validator';

// checks the validation result from a previously added middleware
// provided by express-validator.
export const checkValidationResult = (mapErrors = null) => {
  const mapper = typeof mapErrors === 'function' ? mapErrors : e => e.msg;

  return async (req, res, next) => {
    const validate = validationResult(req);

    // ie. [ {name: "idk", msg: "error msg", etc: "..." }, {...} ],
    if (validate.errors && validate.errors.length) {
      res.json({
        errors: validate.errors.map(mapper),
      });
    } else {
      next();
    }
  };
};

// returns 2 middlewares
export const checkSchemaAndBail = (
  schema,
  locations = ['body'],
  mapErrors = null,
) => {
  return [checkSchema(schema, locations), checkValidationResult(mapErrors)];
};
