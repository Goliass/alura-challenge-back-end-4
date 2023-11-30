import express from "express";

import * as authMiddlewares from "../auth/authMiddlewares.js";
import ExpensesController from "../controllers/expensesController.js";

import { reqParams, paramsValidation } from "../validators/expensesValidator.js";

const expensesRouter = express.Router();

expensesRouter.get('/expenses', 
  authMiddlewares.bearerStrategy, 
  ExpensesController.list); 

expensesRouter.get('/expenses/:id', 
  authMiddlewares.bearerStrategy, 
  paramsValidation(reqParams.id),
  ExpensesController.findById);

expensesRouter.get('/expenses/description/:description', 
  authMiddlewares.bearerStrategy, 
  paramsValidation(reqParams.description),
  ExpensesController.findByDescription);

expensesRouter.get('/expenses/:year/:month', 
  authMiddlewares.bearerStrategy, 
  paramsValidation(reqParams.year, reqParams.month),
  ExpensesController.findByYearAndMonth);

expensesRouter.post('/expenses', 
  authMiddlewares.bearerStrategy, 
  paramsValidation(reqParams.description, reqParams.value,
    reqParams.date, reqParams.category),
  ExpensesController.add); 

expensesRouter.put('/expenses/:id', 
  authMiddlewares.bearerStrategy, 
  paramsValidation(reqParams.id, reqParams.description,
    reqParams.value, reqParams.date, reqParams.category),
  ExpensesController.update);

expensesRouter.delete('/expenses/:id', 
  authMiddlewares.bearerStrategy, 
  paramsValidation(reqParams.id),
  ExpensesController.delete);

export default expensesRouter;