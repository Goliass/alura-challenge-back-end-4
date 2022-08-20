import mongoose from "mongoose";

const collectionName = "expensesCategories";
const sortOrder = {
  ascending: 1,
  descending: -1
}

const expenseCategorySchema = new mongoose.Schema(
  {
    id: {type: String},
    description : {type: String, required: true}
  },
  {
    versionKey: false
  }
);

expenseCategorySchema.index({description: sortOrder.ascending}, {unique: true});

const expensesCategories = mongoose.model(collectionName, expenseCategorySchema);

export default expensesCategories;