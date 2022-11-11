import express from "express";

import { UsersController } from "../controllers/usersController.js";
import * as authMiddlewares from "../auth/authMiddlewares.js";

const usersRouter = express.Router();

usersRouter.get('/users', UsersController.list);
usersRouter.get('/users/:email', UsersController.find);
usersRouter.post('/users', UsersController.add);
usersRouter.delete('/users/:id', UsersController.delete);

usersRouter.post('/login', 
  authMiddlewares.localStrategy,
  UsersController.login);

export default usersRouter;