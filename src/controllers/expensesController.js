import expenses from "../models/Expense.js";

const expensesRelationship = {
  fieldName: "category",
  relatedExternalFieldName: "description"
};

const defaultExpenseCategoryId = "630434804cbef5fa4fa579a2";

class ExpensesController {
  static list = (req, res) => {
    expenses.find()
      .populate('category', 'description')
      .exec((error, expenses) => {
      if (error) {
        console.log(error);
        return res.status(500).json({message: 'Error retrieving expenses'});
      }
      
      return res.status(200).json(expenses);
    });
  };

  static findByDescription = (req, res) => {
    const description = req.params.description;
  
    expenses.find({description: {$regex: description, $options: 'i'}})
      .populate('category', 'description')
      .exec((error, expenses) => {
        if (error) {
          console.log(error);
          return res.status(500).json({message: 'Error retrieving expenses by query'});
        }

        return res.status(200).json(expenses);
      });
  }
    
  static findById = (req, res) => { 
    const id = req.params.id;
  
    expenses.findById(id)
      .populate('category', 'description')
      .exec((error, expenses) => { 
      if (error) {
        return res.status(400).send({message: `${error.message} - Expense ID not found`});
      } else {
        return res.status(200).send(expenses);
      }
    });
  };

  static findByYearAndMonth = (req, res) => {
    const {year, month} = req.params;
    
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
          console.log(error);
          return res.status(500).json({message: 'Error retrieving expenses by year and month'});
        }

        return res.status(200).json(expenses);
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
        return res.status(500).send({message: `${error.message} - Error registering expense`});
      } else {
        return res.status(201).send(expense.toJSON());
      }
    })
  };

  
  static update = (req, res) => { 
    const id = req.params.id;
    const body = req.body;
  
    if ((body && Object.keys(body).length === 0 && Object.getPrototypeOf(body) === Object.prototype) ||
      ('description' in body && !body.description) || 
      ('value' in body && !body.value) || 
      ('date' in body && !body.date) ||
      ('category' in body && !body.category)) {
        return res.status(400).send({message: 'Invalid body'});
    }
  
    if (body.description) body.description = body.description.toUpperCase();
  
    expenses.findByIdAndUpdate(id, {$set: body}, (error, model) => {
      if (error) {
        console.log(error);
        return res.status(500).send({message: error.message});
      } else if (!model) {
        return res.status(404).send();
      } else {
        return res.status(200).send({message: `Expense ${id} sucessfully updated`});
      }
    });
  };
  
  static delete = (req, res) => { 
    const id = req.params.id;
  
    expenses.findByIdAndDelete(id, (error, model) => {
      if (error) {
        console.log(error);
        return res.status(500).send({message: error.message});
      } else if (!model) {
        return res.status(404).send();
      } else {
        return res.status(200).send({message: `Expense ${id} removed`});
      }
    });
  };
}

export default ExpensesController;