import { check, validationResult } from "express-validator";
import { arrayFlat } from "../utils/arrayFlat.js";
import { httpStatus } from "../utils/httpStatus.js";
import { definitions } from "./validator.js";

const reqParams = {
  id: "id",
  descriptionOptional: "descriptionOptional",
  description: "description",
  year: "year",
  month: "month",
  value: "value",
  valueOptional: "valueOptional",
  date: "date",
  dateOptional: "dateOptional",
};

function paramsValidation(...paramNames) {
  const validationMiddlewares = [
    (function validationRules() {
      const params = arrayFlat(paramNames, Infinity);

      let rules = [];

      if (params) {
        params.forEach((param) => {
          switch (param) {
            case reqParams.id:
              rules.push(
                check(reqParams.id)
                  .trim()
                  .isLength({
                    min: definitions.idLength,
                    max: definitions.idLength,
                  })
                  .withMessage(`Must have ${definitions.idLength} characters`)
                  .isHexadecimal()
                  .withMessage("Only hexadecimal characters allowed")
                  .escape()
              );
              break;

            case reqParams.descriptionOptional:
              rules.push(
                check(reqParams.description)
                  .trim()
                  .optional()
                  .isLength({ min: 1, max: 100 })
                  .withMessage(`Length must be between 1 and 100 characters`)
                  .isAlphanumeric("pt-BR", { ignore: " " })
                  .withMessage("Only letters, spaces and numbers allowed")
                  .escape()
              );
              break;

            case reqParams.description:
              rules.push(
                check(reqParams.description)
                  .trim()
                  .isLength({ min: 1, max: 100 })
                  .withMessage(`Length must be between 1 and 100 characters`)
                  .isAlphanumeric("pt-BR", { ignore: " " })
                  .withMessage("Only letters, spaces and numbers allowed")
                  .escape()
              );
              break;

            case reqParams.year:
              rules.push(
                check(reqParams.year)
                  .trim()
                  .isLength({
                    min: definitions.yearLength,
                    max: definitions.yearLength,
                  })
                  .withMessage(`Must have ${definitions.yearLength} digits`)
                  .isInt()
                  .withMessage("Must be a number")
              );
              break;

            case reqParams.month:
              rules.push(
                check(reqParams.month)
                  .trim()
                  .isLength({
                    min: definitions.monthLength,
                    max: definitions.monthLength,
                  })
                  .withMessage(`Must have ${definitions.monthLength} digits`)
                  .isInt({ min: 1, max: 12 })
                  .withMessage("Must be a number between 1 and 12")
              );
              break;

            case reqParams.value:
              rules.push(
                check(reqParams.value)
                  .isFloat({ min: 0.01 })
                  .withMessage("Must be a number greater than 0")
              );
              break;

            case reqParams.valueOptional:
              rules.push(
                check(reqParams.value)
                  .optional()
                  .isFloat({ min: 0.01 })
                  .withMessage("Must be a number greater than 0")
              );
              break;

            case reqParams.date:
              rules.push(
                check(reqParams.date)
                  .isISO8601()
                  .withMessage(`Must be a valid date, in the yyyy-mm-dd format`)
                  .escape()
              );
              break;

            case reqParams.dateOptional:
              rules.push(
                check(reqParams.date)
                  .optional()
                  .isISO8601()
                  .withMessage(`Must be a valid date, in the yyyy-mm-dd format`)
                  .escape()
              );
              break;

            default:
              break;
          }
        });
      }

      return rules;
    })(),

    function validate(req, res, next) {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(httpStatus.badRequest).json(errors);
      }

      next();
    },
  ];

  return validationMiddlewares; //  [ rules[func(), func()], validate() ]
}

export { paramsValidation, reqParams };
