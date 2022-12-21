import receiptsRoutes from "./receiptsRoutes.js";
import expensesRoutes from "./expensesRoutes.js";
import expensesCategoriesRoutes from "./expensesCategoriesRoutes.js";
import extractsRoutes from "./extractsRoutes.js";
import usersRoutes from "./usersRoutes.js";

const routes = (app) => {
  app.get("/", (req, res) => {
    res.status(200).send('Welcome to family budget API!');
  })

  app.use(
    receiptsRoutes,
    expensesRoutes,
    expensesCategoriesRoutes,
    extractsRoutes,
    usersRoutes
  );
}

export default routes;