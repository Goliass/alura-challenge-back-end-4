import expenses from "../models/Expense.js";

const expensesRelationship = {
  fieldName: "category",
  relatedExternalFieldName: "description"
};

const defaultExpenseCategoryId = "630434804cbef5fa4fa579a2";

class ExpensesController {
  static list = (req, res) => {
    const descriptionQuery = req.query.description;

    if (descriptionQuery) {
      expenses.find({description: {$regex: descriptionQuery, $options: 'i'}})
        .populate('category', 'description')
        .exec((error, expenses) => {
          if (error) {
            res.status(500).json({message: 'Error retrieving expenses by query'});
            console.log(error);
          }
          res.status(200).json(expenses);
        });
    } else {
      expenses.find()
        .populate('category', 'description')
        .exec((error, expenses) => {
        if (error) {
          res.status(500).json({message: 'Error retrieving expenses'});
          console.log(error);
        }
        
        res.status(200).json(expenses);
      });
    }
  };
    
  static findById = (req, res) => { 
    const id = req.params.id;
  
    expenses.findById(id)
      .populate('category', 'description')
      .exec((error, expenses) => { 
      if (error) {
        res.status(400).send({message: `${error.message} - Expense ID not found`});
      } else {
        res.status(200).send(expenses);
      }
    });
  };

  static findByYearAndMonth = (req, res) => {
    const {year, month} = req.params;

    if (year.length != 4) {
      res.status(400).json({message: 'year must have 4 digits'});
      return;
    }
    
    expenses.find({
        $expr: {
          $and: [
            { "$eq": [{"$year": "$date"}, year] },
            { "$eq": [{"$month": "$date"}, month] }
          ]
        }
      })
      .exec((error, expenses) => {
        if (error) {
          res.status(500).json({message: 'Error retrieving expenses by year and month'});
          console.log(error);
        }

        res.status(200).json(expenses);
      });
  };
  
  static add = (req, res) => { 
    let body = req.body;
    body.description = body.description.toUpperCase();

    if (!body.category) {
      body.category = defaultExpenseCategoryId;
    }
  
    let expense = new expenses(body);
  
    expense.save((error) => {
      if (error) {
        res.status(500).send({message: `${error.message} - Error registering expense`});
      } else {
        res.status(201).send(expense.toJSON());
      }
    })
  };

  
  static update = (req, res) => { 
    const id = req.params.id;
    const body = req.body;
  
    if ((body && Object.keys(body).length === 0 && Object.getPrototypeOf(body) === Object.prototype) ||
      ('description' in body && !body.description) || 
      ('value' in body && !body.value) || 
      ('date' in body && !body.date)) {
      res.status(400).send({message: 'Invalid body'});
      return;
    }
  
    if (body.description) body.description = body.description.toUpperCase();
  
    expenses.findByIdAndUpdate(id, {$set: body}, (error) => {
      if (!error) {
        res.status(200).send({message: `Expense ${id} sucessfully updated`});
      } else {
        res.status(500).send({message: error.message});
      }
    });
  };
  
  static delete = (req, res) => { 
    const id = req.params.id;
  
    expenses.findByIdAndDelete(id, (error) => {
      if (!error) {
        res.status(200).send({message: `Expense ${id} removed`});
      } else {
        res.status(500).send({message: error.message});
      }
    });
  };

}

export default ExpensesController;