import passport from 'passport';
import { Strategy as LocalStrategy} from 'passport-local';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import * as dotenv from 'dotenv';
dotenv.config();

import { findByEmail, findById } from "../controllers/usersController.js";
import { InvalidArgumentError } from '../errors.js';

function verifyUser(user) {
  try {
    if (!user) {
      throw new InvalidArgumentError('Invalid username or password');
    }
  } catch (error) {
    throw new Error(error); 
  }
}

async function verifyPassword(senha, senhaHash) {
  try {
    const senhaValida = await bcrypt.compare(senha, senhaHash);
    if (!senhaValida) {
      throw new InvalidArgumentError('Invalid username or password');
    }
  } catch (error) {
    throw new Error(error);
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
        const payload = jsonwebtoken.verify(token, process.env.jwtKey);

        findById(payload.id, async (error, user) => {
          try {
            if (error) {
              console.log(error);
              done(error);
            }

            verifyUser(user);
            done(null, user);
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
