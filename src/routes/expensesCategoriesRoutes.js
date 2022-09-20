import express from "express";

import ExpensesCategoriesController from "../controllers/expensesCategoriesController.js";

const expensesCategoriesRouter = express.Router();

expensesCategoriesRouter.get('/expensesCategories', ExpensesCategoriesController.list);
expensesCategoriesRouter.post('/expensesCategories', ExpensesCategoriesController.add);

export default expensesCategoriesRouter;