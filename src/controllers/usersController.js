import users from "../models/User.js";
import * as authentication from "../auth/authentication.js";

class UsersController {

  static list = (req, res) => { 
    users.find((error, users) => {
      if (error) {
        res.status(500).json({message: 'Error retrieving users'});
        console.log(error);
      }
      res.status(200).json(users);
    });
  };

  static find = (req, res) => { 
    const emailParam = req.params.email;

    findByEmail(emailParam, (error, user) => {
      if (error) {
        res.status(500).json({message: 'Error retrieving user by query'});
        console.log(error);
      }

      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json();
      }
    });
  };
  
  static add = async (req, res) => {
    try {
      let body = req.body;
      body.passwordHash = await authentication.generatePassword(body.password);
  
      let user = new users(body);
      ;
    
      user.save((error) => {
        if (error) {
          console.log(error);
          res.status(500).send({message: `${error.message} - Error registering user`});
          return;
        } else {
          res.status(201).send(user.toJSON());
          return;
        }
      })
      
    } catch (error) {
      console.log(error);
      res.status(500).send({message: `${error.message} - Error registering user`});
      return;
    }
  };
  
  static delete = (req, res) => {
    const id = req.params.id;

    const idPattern = /^[0-9a-f]{24}$/i;
    if (!id.match(idPattern)) {
      res.status(400).json({message: `id doesn't match the patern ${idPattern}`});
      return;
    }
    
    users.findByIdAndDelete(id, (error) => {
      if (!error) {
        res.status(200).send({message: `User ${id} removed`});
      } else {
        res.status(500).send({message: error.message});
        console.log(error.message);
      }
    });
  };

  static login = async (req, res) => {
    try {
      res.status(204).send();
    } catch (error) {
      console.log(error);
      res.status(500).send({message: error.message});
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

export { UsersController, findByEmail };