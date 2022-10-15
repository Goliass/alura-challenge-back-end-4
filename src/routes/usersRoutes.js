import express from "express";

import UsersController from "../controllers/usersController.js";

const usersRouter = express.Router();

usersRouter.get('/users', UsersController.list);
usersRouter.post('/users', UsersController.add);
usersRouter.delete('/users/:id', UsersController.delete);

export default usersRouter;