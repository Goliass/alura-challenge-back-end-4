import * as redis from 'redis';

const jwtBlacklistRedisClient = redis.createClient({ prefix: 'jwt-blacklist:' });

export { jwtBlacklistRedisClient };