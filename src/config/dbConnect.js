import mongoose from "mongoose";
import env from "../../.env.js";

const dbLoginData = env();

mongoose.connect(`mongodb+srv://${dbLoginData.DBUSER}:${dbLoginData.DBPASS}@${dbLoginData.DBCLUSTER}.fjfyv.mongodb.net/${dbLoginData.DBNAME}`);
const db = mongoose.connection;

export default db;
