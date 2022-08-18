import express from "express";
import expenses from "../models/Expense.js";

const expensesRouter = express.Router();

expensesRouter.get('/expenses', (req, res) => {
  expenses.find((error, expenses) => {
    if (error) {
      res.status(500).json({message: 'Error retrieving expenses'});
    }
    
    res.status(200).json(expenses);
  });
});
  

expensesRouter.post('/expenses', (req, res) => {
  let body = req.body;
  body.description = body.description.toUpperCase();

  let expense = new expenses(body);

  expense.save((error) => {
    if (error) {
      res.status(500).send({message: `${error.message} - Error registering expense`});
    } else {
      res.status(201).send(expense.toJSON());
    }
  })
})

expensesRouter.get('/expenses/:id', (req, res) => {
  const id = req.params.id;

  expenses.findById(id, (error, expenses) => {
    if (error) {
      res.status(400).send({message: `${error.message} - Expense ID not found`});
    } else {
      res.status(200).send(expenses);
    }
  });
});

expensesRouter.put('/expenses/:id', (req, res) => {
  const id = req.params.id;
  const body = req.body;

  if ((body && Object.keys(body).length === 0 && Object.getPrototypeOf(body) === Object.prototype) ||
    ('description' in body && !body.description) || 
    ('value' in body && !body.value) || 
    ('date' in body && !body.date)) {
    res.status(400).send({message: 'Invalid body'});
    return;
  }

  body.description = body.description.toUpperCase();

  expenses.findByIdAndUpdate(id, {$set: body}, (error) => {
    if (!error) {
      res.status(200).send({message: `Expense ${id} sucessfully updated`});
    } else {
      res.status(500).send({message: error.message});
    }
  });
});

expensesRouter.delete('/expenses/:id', (req, res) => {
  const id = req.params.id;

  expenses.findByIdAndDelete(id, (error) => {
    if (!error) {
      res.status(200).send({message: `Expense ${id} removed`});
    } else {
      res.status(500).send({message: error.message});
    }
  });
});

export default expensesRouter;