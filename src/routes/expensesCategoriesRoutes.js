import express from "express";

import ExpensesCategoriesController from "../controllers/expensesCategoriesController.js";

import { reqParams, paramsValidation } from "../validators/expensesCategoriesValidator.js";

import * as authMiddlewares from "../auth/authMiddlewares.js";

const expensesCategoriesRouter = express.Router();

expensesCategoriesRouter.get('/expensesCategories', authMiddlewares.bearerStrategy, ExpensesCategoriesController.list);

expensesCategoriesRouter.post('/expensesCategories',
  authMiddlewares.bearerStrategy,
  paramsValidation(reqParams.description),
  ExpensesCategoriesController.add);

export default expensesCategoriesRouter;