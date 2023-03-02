import { jwtBlacklistRedisClient } from './jwtBlacklist.js';

import jsonwebtoken from 'jsonwebtoken';
import { createHash } from 'crypto';

function generateTokenHash(token) {
  return createHash('sha256') // algorithm
    .update(token)
    .digest('hex'); // encoding
}

async function add(token) {
  const expirationDate = jsonwebtoken.decode(token).exp;
  const tokenHash = generateTokenHash(token);

  await jwtBlacklistRedisClient.set(tokenHash, 'N/A');
  jwtBlacklistRedisClient.expireAt(tokenHash, expirationDate);
}

async function hasToken(token) {
  const tokenHash = generateTokenHash(token);
  const result = await jwtBlacklistRedisClient.get(tokenHash);

  return result;
}

export {
  add,
  hasToken
};