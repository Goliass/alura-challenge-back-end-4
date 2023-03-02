import { createClient } from 'redis';

const jwtBlacklistRedisClient = createClient({ prefix: 'jwt-blacklist:' });
jwtBlacklistRedisClient.on('error', error => console.log('Redis Client Error', error));

await jwtBlacklistRedisClient.connect();

export { jwtBlacklistRedisClient };