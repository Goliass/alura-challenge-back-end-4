import express from "express";

import * as authMiddlewares from "../auth/authMiddlewares.js";
import { UsersController } from "../controllers/usersController.js";

const usersRouter = express.Router();

usersRouter.get('/users', authMiddlewares.bearerStrategy, UsersController.list);
usersRouter.get('/users/email/:email', authMiddlewares.bearerStrategy, UsersController.findWithEmail);
usersRouter.get('/users/id/:id', authMiddlewares.bearerStrategy, UsersController.findWithId);
usersRouter.post('/users', authMiddlewares.bearerStrategy, UsersController.add);

usersRouter.delete('/users/id/:id', authMiddlewares.bearerStrategy, UsersController.delete);

usersRouter.post('/login', 
  authMiddlewares.localStrategy,
  UsersController.login);

export default usersRouter;