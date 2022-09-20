import express from "express";

import ExtractsController from "../controllers/extractsController.js";

const extractsRouter = express.Router();
extractsRouter.get('/extract/:year/:month', ExtractsController.byYearAndMonth);

export default extractsRouter;