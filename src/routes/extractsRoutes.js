import express from "express";

import * as authMiddlewares from "../auth/authMiddlewares.js";
import ExtractsController from "../controllers/extractsController.js";

const extractsRouter = express.Router();
extractsRouter.get('/extract/:year/:month', authMiddlewares.bearerStrategy, ExtractsController.byYearAndMonth);

export default extractsRouter;