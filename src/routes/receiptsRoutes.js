import express from "express";

import * as authMiddlewares from "../auth/authMiddlewares.js";
import ReceiptsController from "../controllers/receiptsController.js";

const receiptsRouter = express.Router();

receiptsRouter.get('/receipts', authMiddlewares.bearerStrategy, ReceiptsController.list);
receiptsRouter.get('/receipts/:id', authMiddlewares.bearerStrategy, ReceiptsController.findById);
receiptsRouter.get('/receipts/:year/:month', authMiddlewares.bearerStrategy, ReceiptsController.findByYearAndMonth);
receiptsRouter.post('/receipts', authMiddlewares.bearerStrategy, ReceiptsController.add);
receiptsRouter.put('/receipts/:id', authMiddlewares.bearerStrategy, ReceiptsController.update);
receiptsRouter.delete('/receipts/:id', authMiddlewares.bearerStrategy, ReceiptsController.delete);

export default receiptsRouter;