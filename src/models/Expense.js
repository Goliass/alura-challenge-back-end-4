import mongoose from "mongoose";

const collectionName = "expenses";
const expensesCategoriesCollectionName = "expenses_categories";
const sortOrder = {
  ascending: 1,
  descending: -1
}

const expenseSchema = new mongoose.Schema(
  {
    id: {type: String},
    description : {type: String, required: true},
    value: {type: Number, required: true},
    date: {type: Date, required: true},
    category: {type: mongoose.Schema.Types.ObjectId, ref: expensesCategoriesCollectionName, required: true},
  }
);

expenseSchema.index({date: sortOrder.ascending, description: sortOrder.ascending}, {unique: true});

const expenses = mongoose.model(collectionName, expenseSchema);

export default expenses;