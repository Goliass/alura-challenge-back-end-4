import express from "express";

import ExpensesController from "../controllers/expensesController.js";

const expensesRouter = express.Router();

expensesRouter.get('/expenses', ExpensesController.list);
expensesRouter.get('/expenses/:id', ExpensesController.findById);
expensesRouter.get('/expenses/:year/:month', ExpensesController.findByYearAndMonth);
expensesRouter.post('/expenses', ExpensesController.add);
expensesRouter.put('/expenses/:id', ExpensesController.update);
expensesRouter.delete('/expenses/:id', ExpensesController.delete);

export default expensesRouter;