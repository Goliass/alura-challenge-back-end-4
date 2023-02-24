import * as jwtBlacklistRedisClient from './jwtBlacklist.js';

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

  await jwtBlacklistRedisClient.set(tokenHash, '');
  jwtBlacklistRedisClient.expireat(tokenHash, expirationDate);
}

async function hasToken(token) {
  const tokenHash = generateTokenHash(token);
  const result = await jwtBlacklistRedisClient.get(tokenHash);

  return result === 1;
}

export {
  add,
  hasToken
};