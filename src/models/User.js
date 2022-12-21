import mongoose from "mongoose";

const collectionName = "users";
const sortOrder = {
  ascending: 1,
  descending: -1
}

const schema = new mongoose.Schema(
  {
    id: {type: String},
    name: {type: String, required: true},
    email: {type: String, required: true},
    passwordHash: {type: String, required: true},
    loginAuthorized: {type: Boolean, required: true, default:false}
  }
);

schema.index({email: sortOrder.ascending}, {unique: true});

const users = mongoose.model(collectionName, schema);

export default users;