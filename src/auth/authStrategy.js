import passport from 'passport';
import Strategy from 'passport-local';
import bcrypt from 'bcrypt';

import { findByEmail } from "../controllers/usersController.js";
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
      new Strategy(
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

export { localStrategy };
