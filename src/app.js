import express from "express";
import db from "./config/dbConnect.js";

import receipts from "./models/Receipt.js";

db.on("error", console.log.bind(console, 'Database connection error'));
db.once("open", () => {
  console.log('Database connection succeed');
})

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('Welcome to family buget API!');
}) 

app.get('/receipts', (req, res) => {
  receipts.find((error, receipts) => {
    if (error) {
      res.status(500).json({message: 'Error retrieving receipts'});
    }
    res.status(200).json(receipts);
  });
});

export default app;