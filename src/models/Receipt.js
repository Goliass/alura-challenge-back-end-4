import mongoose from "mongoose";

const collectionName = "receipts";

const receiptSchema = new mongoose.Schema(
  {
    id: {type: String},
    description : {type: String, required: true},
    value: {type: Number, required: true},
    date: {type: Date}
  }
);

const receipts = mongoose.model(collectionName, receiptSchema);

export default receipts;