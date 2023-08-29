import express from "express";

import * as authMiddlewares from "../auth/authMiddlewares.js";
import { UsersController } from "../controllers/usersController.js";

const usersRouter = express.Router();

import { reqParams, paramsValidation } from "../validators/usersValidator.js";

usersRouter.get('/users', authMiddlewares.bearerStrategy, UsersController.list);

usersRouter.get('/users/email/:email', 
  authMiddlewares.bearerStrategy, 
  paramsValidation(reqParams.email),
  UsersController.findWithEmail);

usersRouter.get('/users/id/:id', authMiddlewares.bearerStrategy, 
  paramsValidation(reqParams.id), 
  UsersController.findWithId);

usersRouter.post('/users', 
  paramsValidation(reqParams.name, reqParams.email, reqParams.password),
  UsersController.add);

usersRouter.delete('/users/id/:id', 
authMiddlewares.bearerStrategy, 
paramsValidation(reqParams.id),
UsersController.delete);

usersRouter.post('/login', 
  paramsValidation(reqParams.email, reqParams.password),
  authMiddlewares.localStrategy,
  UsersController.login);

usersRouter.get('/logout', authMiddlewares.bearerStrategy, UsersController.logout);

export default usersRouter;