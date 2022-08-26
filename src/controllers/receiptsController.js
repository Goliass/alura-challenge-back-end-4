import receipts from "../models/Receipt.js";

class ReceiptsController {

  static list = (req, res) => { 
    const descriptionQuery = req.query.description;

    if (descriptionQuery) {
      receipts.find({description: {$regex: descriptionQuery, $options: 'i'}})
        .exec((error, receipts) => {
          if (error) {
            res.status(500).json({message: 'Error retrieving receipts by query'});
            console.log(error);
          }
          res.status(200).json(receipts);
        });
    } else {
      receipts.find((error, receipts) => {
        if (error) {
          res.status(500).json({message: 'Error retrieving receipts'});
          console.log(error);
        }
        res.status(200).json(receipts);
      });
    }
  };

  static listByMonth = (req, res) => {
    const {year, month} = req.params;

    if (year.length != 4) {
      res.status(400).json({message: 'year must have 4 digits'});
      return;
    }
    
    receipts.find({
        $expr: {
          $and: [
            { "$eq": [{"$year": "$date"}, year] },
            { "$eq": [{"$month": "$date"}, month] }
          ]
        }
      })
      .exec((error, receipts) => {
      if (error) {
        res.status(500).json({message: 'Error retrieving receipts'});
        console.log(error);
      }
      res.status(200).json(receipts);
    });
  };

  
  static add = (req, res) => {
    let body = req.body;
    body.description = body.description.toUpperCase(); 
  
    let receipt = new receipts(body);
  
    receipt.save((error) => {
      if (error) {
        res.status(500).send({message: `${error.message} - Error registering receipt`});
      } else {
        res.status(201).send(receipt.toJSON());
      }
    })
  };
  
  static find = (req, res) => {
    const id = req.params.id;
  
    receipts.findById(id, (error, receipts) => {
      if (error) {
        res.status(400).send({message: `${error.message} - Receipt ID not found`});
      } else {
        res.status(200).send(receipts);
      }
    });
  };
  
  static update = (req, res) => {
    const id = req.params.id;
    const body = req.body;
  
    if ((body && Object.keys(body).length === 0 && Object.getPrototypeOf(body) === Object.prototype) ||
      ('description' in body && !body.description) || 
      ('value' in body && !body.value) || 
      ('date' in body && !body.date)) {
      res.status(400).send({message: 'Invalid body'});
      return;
    }
  
    body.description = body.description.toUpperCase();
  
    receipts.findByIdAndUpdate(id, {$set: body}, (error) => {
      if (!error) {
        res.status(200).send({message: `Receipt ${id} sucessfully updated`});
      } else {
        res.status(500).send({message: error.message});
      }
    });
  };
  
  static delete = (req, res) => {
    const id = req.params.id;
  
    receipts.findByIdAndDelete(id, (error) => {
      if (!error) {
        res.status(200).send({message: `Receipt ${id} removed`});
      } else {
        res.status(500).send({message: error.message});
      }
    });
  };

}

export default ReceiptsController;