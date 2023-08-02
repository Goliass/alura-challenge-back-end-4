import * as dotenv from 'dotenv';
dotenv.config();

import mongoose from "mongoose";

mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@${process.env.DBNAME}.${process.env.SUBDOMAIN}.mongodb.net`);

const db = mongoose.connection;

export default db;
