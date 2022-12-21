import express from "express";

import * as authMiddlewares from "../auth/authMiddlewares.js";
import ExpensesController from "../controllers/expensesController.js";

const expensesRouter = express.Router();

expensesRouter.get('/expenses', authMiddlewares.bearerStrategy, ExpensesController.list);
expensesRouter.get('/expenses/:id', authMiddlewares.bearerStrategy, ExpensesController.findById);
expensesRouter.get('/expenses/:year/:month', authMiddlewares.bearerStrategy, ExpensesController.findByYearAndMonth);
expensesRouter.post('/expenses', authMiddlewares.bearerStrategy, ExpensesController.add);
expensesRouter.put('/expenses/:id', authMiddlewares.bearerStrategy, ExpensesController.update);
expensesRouter.delete('/expenses/:id', authMiddlewares.bearerStrategy, ExpensesController.delete);

export default expensesRouter;