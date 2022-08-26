import express from "express";

import ReceiptsController from "../controllers/receiptsController.js";

const receiptsRouter = express.Router();

receiptsRouter.get('/receipts', ReceiptsController.list);
receiptsRouter.get('/receipts/:id', ReceiptsController.findById);
receiptsRouter.get('/receipts/:year/:month', ReceiptsController.findByYearAndMonth);
receiptsRouter.post('/receipts', ReceiptsController.add);
receiptsRouter.put('/receipts/:id', ReceiptsController.update);
receiptsRouter.delete('/receipts/:id', ReceiptsController.delete);

export default receiptsRouter;