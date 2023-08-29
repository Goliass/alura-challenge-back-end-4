import { check, validationResult } from 'express-validator';
import { arrayFlat } from '../utils/arrayFlat.js';
import { httpStatus } from "../utils/httpStatus.js";

const reqParams = {
  name: "name",
  email: "email",
  password: "password",
  id: "id"
};

const idLength = 24;

function paramsValidation(...paramNames) {
  const validationMiddlewares = [

    function validationRules() {
      const params = arrayFlat(paramNames, Infinity);

      let rules = [];

      if (params) {
        params.forEach(param => {
          switch(param) {

            case reqParams.name:
              rules.push(
                check(reqParams.name)
                  .trim()
                  .isLength({ min: 3, max: 100 }).withMessage(`Length must be between 3 and 100 characters`)
                  .isAlpha('pt-BR', { ignore: " " }).withMessage('Only letters and spaces allowed')
                  .escape()
              )
              break;

            case reqParams.email:
              rules.push(
                check(reqParams.email)
                  .trim()
                  .isEmail().withMessage('Invalid email')
                  .isLength({ max: 100 }).withMessage(`Maximum length: 100 characters`)
                  .escape()
              )
              break;

            case reqParams.password:
              rules.push(
                check(reqParams.password)
                  .trim()
                  .isStrongPassword().withMessage(`It must have at least 8 characters, 1 uppercase and 1 lowercase letter, 1 number and 1 symbol`)
                  .escape()
              )
              break;

            case reqParams.id:
              rules.push(
                check(reqParams.id)
                  .trim()
                  .isLength({ min: idLength, max: idLength }).withMessage(`It must have ${idLength} characters`)
                  .isHexadecimal().withMessage('Only alphanumeric characters allowed')
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

  return validationMiddlewares; //  [ rules[func(), func()], validate() ] 
}

export { 
  paramsValidation,
  reqParams
}