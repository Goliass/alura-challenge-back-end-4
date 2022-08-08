import express from "express";
import db from "./config/dbConnect.js";

db.on("error", console.log.bind(console, 'Database connection error'));
db.once("open", () => {
  console.log('Database connection succeed');
})

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('Welcome to family buget API!');
}) 


export default app;