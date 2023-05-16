import * as dotenv from 'dotenv';

import { createClient } from 'redis';
import { shutdownService } from '../src/errors.js';

process.on('uncaughtException', (error) => {
  console.log(`Uncaught exception: ${error}`);

  shutdownService(error);
});

dotenv.config();
let countRedisServerErrors = 0;

let creatClientOptions = {
  prefix: 'jwt-blacklist:'
}

if (process.env.REDIS_PASS) { 
  creatClientOptions.url = `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASS}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
} else { // localhost
  creatClientOptions.socket = {
    host: process.env.REDIS_HOST,
    port: process.env.PORT
  }
}

creatClientOptions.disableOfflineQueue = true;

const jwtBlacklistRedisClient = createClient(creatClientOptions);

jwtBlacklistRedisClient.on('ready', () => {
  countRedisServerErrors = 0;
});

jwtBlacklistRedisClient.on('error', error => {
  countRedisServerErrors++;

  const errorMessage = `In-memory database connection error: ${JSON.stringify(error)}`;
  console.log(errorMessage);
  
  if (countRedisServerErrors >= process.env.REDIS_MAX_CONNECTION_ATTEMPTS) { // attempts before throwing
    shutdownService(errorMessage);
  }
});

await jwtBlacklistRedisClient.connect();
console.log("In-memory database connection succeed");

export { jwtBlacklistRedisClient };