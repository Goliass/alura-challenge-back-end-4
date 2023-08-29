import { check, validationResult } from 'express-validator';
import { arrayFlat } from '../utils/arrayFlat.js';
import { httpStatus } from "../utils/httpStatus.js";

const reqParams = {
  description: "description",
};

function paramsValidation(...paramNames) {
  const validationMiddlewares = [

    function validationRules() {
      const params = arrayFlat(paramNames, Infinity);

      let rules = [];

      if (params) {
        params.forEach(param => {
          switch (param) {

            case reqParams.description:
              rules.push(
                check(reqParams.description)
                  .trim()
                  .isLength({ min: 3 }).withMessage(`The parameter '${reqParams.description}' must have at least 3 characters`)
                  .escape()
              )
              break;

            default:
              break;
          }
        });
      }

      return rules;
    }(),

    function validate(req, res, next) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(httpStatus.badRequest).json(errors);
      }

      next();
    }
  ];

  return validationMiddlewares;
}

export {
  paramsValidation,
  reqParams
}