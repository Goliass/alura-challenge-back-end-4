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

app.post('/receipts', (req, res) => {
  let body = req.body;
  body.description = body.description.toUpperCase();

  let receipt = new receipts(body);

  receipt.save((error) => {
    if(error) {
      res.status(500).send({message: `${error.message} - Error registering receipt`});
    } else {
      res.status(201).send(receipt.toJSON());
    }
  })
})

export default app;