import express from "express";

import ExpensesCategoriesController from "../controllers/expensesCategoriesController.js";
import * as authMiddlewares from "../auth/authMiddlewares.js";

const expensesCategoriesRouter = express.Router();

expensesCategoriesRouter.get('/expensesCategories', authMiddlewares.bearerStrategy, ExpensesCategoriesController.list);
expensesCategoriesRouter.post('/expensesCategories', authMiddlewares.bearerStrategy, ExpensesCategoriesController.add);

export default expensesCategoriesRouter;