import bcrypt from 'bcrypt';

import jsonwebtoken from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

async function generatePassword(password) {
  return await bcrypt.hash(password, parseInt(process.env.saltRounds));
}

function generateJwtToken(user) {
  const payload = {
    id: user._id
  };

  const token = jsonwebtoken.sign(payload, process.env.jwtKey, { expiresIn: process.env.jwtExpirationTimeSpan });
  return token;
}

export {
  generatePassword,
  generateJwtToken
};