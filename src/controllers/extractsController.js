import receipts from "../models/Receipt.js";
import expenses from "../models/Expense.js";

class ExtractsController {

  static byYearAndMonth = (req, res) => {
    const { year, month } = req.params;

    if (year.length != 4) {
      res.status(400).json({message: 'year must have 4 digits'});
      return;
    }  

    Promise.all([
      calculateMonthReceiptsExtract(year, month),
      calculateMonthExpensesExtract(year, month),
      calculateMonthExpensesByCategoryExtract(year, month)  
    ])
    .then(monthExtracts => {
      let extract = {
        receiptsTotal: monthExtracts[0],
        expensesTotal: monthExtracts[1],
        balance: monthExtracts[0] - monthExtracts[1],
        expensesByCategory: []
      }
 
      if (monthExtracts[2] != 0) { // has expenses by category

        monthExtracts[2].forEach(monthExpenseCategory => {
          extract.expensesByCategory.push({key: monthExpenseCategory._id.category, value: monthExpenseCategory.value});
        })
      }

      res.status(200).json(extract);
      return;
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({message: `Error retrieving extract by year and month (${year}-${month})`});
    }); 
  };
}

function calculateMonthReceiptsExtract(year, month) {
  let monthReceiptsTotal = 0;

  return new Promise((resolve, reject) => {
    receipts.aggregate(
      [
        {
          $addFields: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          }
        },
        { 
          $match : { 
            "year": parseInt(year), 
            "month" : parseInt(month)
          } 
        },
        {
          $group : {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" }
            },
            value: { $sum: "$value" }
          }
        }
    ])
   .exec((error, receiptsTotal) => {
      if (error) {
        console.log(error);
        reject('Error retrieving extract of receipts by year and month');
      }
  
      if (receiptsTotal.length > 0) {
        monthReceiptsTotal = receiptsTotal[0].value;
      }
  
      resolve(monthReceiptsTotal);
      return;
    });
  });
}

function calculateMonthExpensesExtract(year, month) {
  let monthExpensesTotal = 0;

  return new Promise((resolve, reject) => {
    expenses.aggregate(
      [
        {
          $addFields: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          }
        },
        { 
          $match : { 
            "year": parseInt(year), 
            "month" : parseInt(month)
          } 
        },
        {
          $group : {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" }
            },
            value: { $sum: "$value" }
          }
        }
      ])
      .exec((error, expensesTotal) => {
        if (error) {
          console.log(error);
          reject('Error retrieving extract of expenses by year and month');
          return;
        }
    
        if (expensesTotal.length > 0) {
          monthExpensesTotal = expensesTotal[0].value;
        }
    
        resolve(monthExpensesTotal);
        return;
      });
  });
}

function calculateMonthExpensesByCategoryExtract(year, month) {
  let monthExpensesByCategory = 0;

  return new Promise((resolve, reject) => {
    expenses.aggregate(
      [
        { 
          $lookup: { // performs a left outer join to a collection in the same database (it adds a new array field to each input document/row)
            localField: 'category', // expenses collection
            
            from: 'expenses_categories', // the collection to perform the join with
            foreignField: '_id', // field from the collection specified in the "from" field above
            as: 'Category' // specifies the name of the new array field to add to the input documents
          }
        },
        { 
          $unwind: '$Category' // Deconstructs an array field from the input documents (ex: { "_id" : 1, "item" : "ABC1", sizes: [ "S", "M", "L"] }) 
                               // to output a document/row for each element
        },
        {
          $addFields: { // add new fields to documents (rows)
            year: { $year: "$date" },
            month: { $month: "$date" },
          }
        },
        { 
          $match : { // filtering the documents/rows by the fields added above
            "year": parseInt(year), 
            "month" : parseInt(month)
          } 
        },
        {
          $group : {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" },
              category: "$Category.description"
            },
            value: { $sum: "$value" }
          }
        }
      ])
      .exec((error, expensesByCategoryTotal) => {
        if (error) {
          console.log(error);
          reject('Error retrieving extract of expenses by category, year and month');
          return;
        }
    
        if (expensesByCategoryTotal.length > 0) {
          monthExpensesByCategory = expensesByCategoryTotal;
        }
    
        resolve(monthExpensesByCategory);
        return;
      });
  });
}

export default ExtractsController;