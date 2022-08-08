import mongoose from "mongoose";
import env from "../../.env.js";

const dbLoginData = env();

mongoose.connect(`mongodb+srv://${dbLoginData.DBUSER}:${dbLoginData.DBPASS}@${dbLoginData.DBNAME}.fjfyv.mongodb.net`);
const db = mongoose.connection;

export default db;
