import ExpenseCategory from "../models/ExpenseCategory.js";

class ExpensesCategoriesController {

  static list = (req, res) => { 
    ExpenseCategory.find((error, expensesCategories) => {
      if (error) {
        res.status(500).json({message: 'Error retrieving expenses categories'});
        console.log(error);
      }

      res.status(200).json(expensesCategories);
    });
  };

  static add = (req, res) => { 
    let body = req.body;
    body.description = body.description.toUpperCase();
  
    let expenseCategory = new ExpenseCategory(body);
  
    expenseCategory.save((error) => {
      if (error) {
        res.status(500).send({message: `${error.message} - Error registering expense category`});
      } else {
        res.status(201).send(expenseCategory.toJSON());
      }
    })
  };
}

export default ExpensesCategoriesController;