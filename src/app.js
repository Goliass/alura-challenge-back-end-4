import express from "express";

import db from "./config/dbConnect.js";
import routes from "./routes/routes.js";

db.on("error", console.log.bind(console, 'Database connection error'));
db.once("open", () => {
  console.log('Database connection succeed');
})

import { localStrategy } from "./auth/authStrategy.js";
localStrategy();

import * as jwtBlacklistRedisClient from '../redis/jwtBlacklist.js';

const app = express();

app.use(express.json());
routes(app);

export default app;