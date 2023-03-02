import passport from 'passport';
import { Strategy as LocalStrategy} from 'passport-local';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import * as dotenv from 'dotenv';
dotenv.config();

import { findByEmail, findById } from "../controllers/usersController.js";
import { InvalidArgumentError, UnauthorizedUserError } from '../errors.js';
import * as manageJwtBlacklist from '../../redis/manageJwtBlacklist.js';

function verifyUser(user) {
  try {
    if (!user) {
      throw new InvalidArgumentError('Invalid username or password');
    }
  } catch (error) {
    throw new Error(error); 
  }
}

async function verifyPassword(password, passwordHash) {
  try {
    const isPasswordValid = await bcrypt.compare(password, passwordHash);
    if (!isPasswordValid) {
      throw new InvalidArgumentError('Invalid username or password');
    }
  } catch (error) {
    throw new Error(error);
  }
}

function verifyUserLoginAuthorization(user) {
  if (!user.loginAuthorized) {
    throw new UnauthorizedUserError('User unauthorized');
  }
}

async function verifyTokenExpiredByLogout(token) {
  const tokenExpired = await manageJwtBlacklist.hasToken(token);

  if (tokenExpired) {
    throw new jsonwebtoken.JsonWebTokenError('Token expired by logout');
  }
}

const localStrategy = () => {
  try {
    passport.use(
      new LocalStrategy(
        {
          usernameField: 'email',
          passwordField: 'password',
          session: false
        },
        (email, password, done) => {
          try {  
            findByEmail(email, async (error, user) => {
              try {
                if (error) {
                  console.log(error);
                  done(error);
                }
    
                verifyUser(user);
                await verifyPassword(password, user.passwordHash);
                verifyUserLoginAuthorization(user);

                done(null, user);
              } catch (error) {
                console.log(error);
                done(error);
                throw new Error(error);
              }
            });
          } catch (error) {
            console.log(error);
            done(error);
            throw new Error(error);
          } 
        }
      )
    );
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

passport.use(
  new BearerStrategy(
    async (token, done) => {
      try {
        await verifyTokenExpiredByLogout(token);

        const payload = jsonwebtoken.verify(token, process.env.jwtKey);

        findById(payload.id, async (error, user) => {
          try {
            if (error) {
              console.log(error);
              done(error);
            }

            verifyUser(user);
            verifyUserLoginAuthorization(user);

            done(null, user, { token: token });
          } catch (error) {
            console.log(error);
            done(error);
          }
        }); 
      } catch (error) {
        console.log(error);
        done(error);
      }      
    }
  )
)

export { localStrategy };
