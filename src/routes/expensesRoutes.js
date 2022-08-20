import express from "express";

import ExpensesController from "../controllers/expensesController.js";

const expensesRouter = express.Router();

expensesRouter.get('/expenses', ExpensesController.list);
expensesRouter.post('/expenses', ExpensesController.add);
expensesRouter.get('/expenses/:id', ExpensesController.find);
expensesRouter.put('/expenses/:id', ExpensesController.update);
expensesRouter.delete('/expenses/:id', ExpensesController.delete);

export default expensesRouter;