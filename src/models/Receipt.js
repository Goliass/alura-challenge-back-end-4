import mongoose from "mongoose";

const collectionName = "receipts";
const sortOrder = {
  ascending: 1,
  descending: -1
}

const receiptSchema = new mongoose.Schema(
  {
    id: {type: String},
    description : {type: String, required: true},
    value: {type: Number, required: true},
    date: {type: Date, required: true}
  }
);

receiptSchema.index({date: sortOrder.ascending, description: sortOrder.ascending}, {unique: true});

const receipts = mongoose.model(collectionName, receiptSchema);

export default receipts;