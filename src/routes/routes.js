import express from "express";
import receiptsRoutes from "./receiptsRoutes.js";
import expensesRoutes from "./expensesRoutes.js";
import expensesCategoriesRoutes from "./expensesCategoriesRoutes.js";

const routes = (app) => {
  // app.route('/').get((req, res) => {
  app.get("/", (req, res) => {
    res.status(200).send('Welcome to family budget API!');
  })

  app.use(
    express.json(),
    receiptsRoutes,
    expensesRoutes,
    expensesCategoriesRoutes
  );
}

export default routes;