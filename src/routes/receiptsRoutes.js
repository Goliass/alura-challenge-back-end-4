import express from "express";

import ReceiptsController from "../controllers/receiptsController.js";

const receiptsRouter = express.Router();

receiptsRouter.get('/receipts', ReceiptsController.list);
receiptsRouter.post('/receipts', ReceiptsController.add);
receiptsRouter.get('/receipts/:id', ReceiptsController.find);
receiptsRouter.put('/receipts/:id', ReceiptsController.update);
receiptsRouter.delete('/receipts/:id', ReceiptsController.delete);

export default receiptsRouter;