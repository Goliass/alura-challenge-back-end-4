import express from "express";

import * as authMiddlewares from "../auth/authMiddlewares.js";
import ReceiptsController from "../controllers/receiptsController.js";

import {
  reqParams,
  paramsValidation,
} from "../validators/receiptsValidator.js";

const receiptsRouter = express.Router();

receiptsRouter.get(
  "/receipts",
  authMiddlewares.bearerStrategy,
  ReceiptsController.list
);

receiptsRouter.get(
  "/receipts/description/:description",
  authMiddlewares.bearerStrategy,
  paramsValidation(reqParams.descriptionOptional),
  ReceiptsController.findByDescription
);

receiptsRouter.get(
  "/receipts/:id",
  authMiddlewares.bearerStrategy,
  paramsValidation(reqParams.id),
  ReceiptsController.findById
);

receiptsRouter.get(
  "/receipts/:year/:month",
  authMiddlewares.bearerStrategy,
  paramsValidation(reqParams.year, reqParams.month),
  ReceiptsController.findByYearAndMonth
);

receiptsRouter.post(
  "/receipts",
  authMiddlewares.bearerStrategy,
  paramsValidation(reqParams.description, reqParams.value, reqParams.date),
  // paramsValidation(reqParams.description, reqParams.value, reqParams.date),
  ReceiptsController.add
);

receiptsRouter.put(
  "/receipts/:id",
  authMiddlewares.bearerStrategy,
  paramsValidation(
    reqParams.id,
    reqParams.descriptionOptional,
    reqParams.valueOptional,
    reqParams.dateOptional
  ),
  ReceiptsController.update
);

receiptsRouter.delete(
  "/receipts/:id",
  authMiddlewares.bearerStrategy,
  paramsValidation(reqParams.id),
  ReceiptsController.delete
);

export default receiptsRouter;
