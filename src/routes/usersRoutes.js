import express from "express";

import { UsersController } from "../controllers/usersController.js";
import * as authMiddlewares from "../auth/authMiddlewares.js";

const usersRouter = express.Router();

usersRouter.get('/users', UsersController.list);
usersRouter.get('/users/email/:email', UsersController.findWithEmail);
usersRouter.get('/users/id/:id', UsersController.findWithId);
usersRouter.post('/users', UsersController.add);
usersRouter.delete('/users/:id', UsersController.delete);

usersRouter.post('/login', 
  authMiddlewares.localStrategy,
  UsersController.login);

export default usersRouter;