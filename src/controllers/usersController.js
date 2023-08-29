import users from "../models/User.js";
import * as authentication from "../auth/authentication.js";

import * as manageJwtBlacklist from '../../redis/manageJwtBlacklist.js';

class UsersController {

  static list = (req, res) => { 
    users.find((error, users) => {
      if (error) {
        console.log(error);
        return res.status(500).json({message: 'Error retrieving users'});
      }
      return res.status(200).json(users);
    });
  };

  static findWithEmail = (req, res) => { 
    const emailParam = req.params.email;

    findByEmail(emailParam, (error, user) => {
      if (error) {
        console.log(error);
        return res.status(500).json({message: 'Error retrieving user by query'});
      }

      if (user) {
        return res.status(200).json(user);
      } else {
        return res.status(404).json();
      }
    });
  };

  static findWithId = (req, res) => { 
    const idParam = req.params.id;

    findById(idParam, (error, user) => {
      if (error) {
        console.log(error);
        return res.status(500).json({message: `Error retrieving user by Id '${idParam}'`});
      }

      if (user) {
        return res.status(200).json(user);
      } else {
        return res.status(404).json();
      }
    });
  };
  
  static add = async (req, res) => {
    try {
      let body = req.body;
      body.passwordHash = await authentication.generatePassword(body.password);
  
      body.loginAuthorized = false;
      let user = new users(body);
      ;
    
      user.save((error) => {
        if (error) {
          console.log(error);
          return res.status(500).send({message: `${error.message} - Error registering user`});
        } else {
          return res.status(201).send(user.toJSON());
        }
      })
      
    } catch (error) {
      console.log(error);
      return res.status(500).send({message: `${error.message} - Error registering user`});
    }
  };
  
  static delete = (req, res) => {
    const id = req.params.id;
    
    users.findByIdAndDelete(id, (error, model) => {
      if (error) {
        console.log(error);
        return res.status(500).send({message: error.message});
      } else if (!model) {
        return res.status(404).send();
      } else {
        return res.status(200).send({message: `User ${id} removed`});
      }
    });
  };

  static login = async (req, res) => {
    try {
      const token = authentication.generateJwtToken(req.user);
      res.set('Authorization', token);
      return res.status(204).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send({message: error.message});
    }
  }

  static logout = async (req, res) => {
    try {
      const token = req.token;
      await manageJwtBlacklist.add(token);
      
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

function findByEmail(email, func) {
  try {
    users.findOne({ email: email }, func);
  } catch (error) {
   console.log(error); 
   throw new Error(error);
  }
}

function findById(id, func) {
  try {
    users.findOne({ _id: id }, func);
  } catch (error) {
   console.log(error); 
   throw new Error(error);
  }
}

export { UsersController, findByEmail, findById };