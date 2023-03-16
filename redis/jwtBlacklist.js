import * as dotenv from 'dotenv';
dotenv.config();

import { createClient } from 'redis';

let creatClientOptions = {
  prefix: 'jwt-blacklist:'
}

if (process.env.REDIS_PASS) { 
  creatClientOptions.url = `redis://default:${process.env.REDIS_PASS}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
} else { // localhost
  creatClientOptions.socket = {
    host: process.env.REDIS_HOST,
    port: process.env.PORT
  }
}

const jwtBlacklistRedisClient = createClient(creatClientOptions);

jwtBlacklistRedisClient.on('error', error => console.log('In-memory database connection error', error));

await jwtBlacklistRedisClient.connect();
console.log("In-memory database connection succeed");

export { jwtBlacklistRedisClient };