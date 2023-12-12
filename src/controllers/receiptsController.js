import receipts from "../models/Receipt.js";

class ReceiptsController {
  static list = (req, res) => {
    receipts.find((error, receipts) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Error retrieving receipts" });
      }
      return res.status(200).json(receipts);
    });
  };

  static findByDescription = (req, res) => {
    const descriptionParam = req.params.description;

    receipts
      .find({ description: { $regex: descriptionParam, $options: "i" } })
      .exec((error, receipts) => {
        if (error) {
          console.log(error);
          return res
            .status(500)
            .json({ message: "Error retrieving receipts by query" });
        }
        return res.status(200).json(receipts);
      });
  };

  static findById = (req, res) => {
    const id = req.params.id;

    receipts.findById(id, (error, receipts) => {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .send({ message: `${error.message} - Error finding receipt ${id}` });
      } else {
        return res.status(200).send(receipts);
      }
    });
  };

  static findByYearAndMonth = (req, res) => {
    const { year, month } = req.params;

    receipts
      .find({
        $expr: {
          $and: [
            { $eq: [{ $year: "$date" }, year] },
            { $eq: [{ $month: "$date" }, month] },
          ],
        },
      })
      .exec((error, receipts) => {
        if (error) {
          console.log(error);
          return res
            .status(500)
            .json({ message: "Error retrieving receipts by year and month" });
        }
        return res.status(200).json(receipts);
      });
  };

  static add = (req, res) => {
    let body = req.body;
    body.description = body.description.toUpperCase();

    let receipt = new receipts(body);

    receipt.save((error) => {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .send({ message: `${error.message} - Error registering receipt` });
      } else {
        return res.status(201).send(receipt.toJSON());
      }
    });
  };

  static update = (req, res) => {
    const id = req.params.id;
    const body = req.body;

    if (
      (body &&
        Object.keys(body).length === 0 &&
        Object.getPrototypeOf(body) === Object.prototype) ||
      ("description" in body && !body.description) ||
      ("value" in body && !body.value) ||
      ("date" in body && !body.date)
    ) {
      return res.status(400).send({ message: "Invalid body" });
    }

    if ("description" in body) {
      body.description = body.description.toUpperCase();
    }

    receipts.findByIdAndUpdate(id, { $set: body }, (error, model) => {
      if (error) {
        console.log(error);
        return res.status(500).send({ message: error.message });
      } else if (!model) {
        return res.status(404).send();
      } else {
        return res
          .status(200)
          .send({ message: `Receipt ${id} sucessfully updated` });
      }
    });
  };

  static delete = (req, res) => {
    const id = req.params.id;

    receipts.findByIdAndDelete(id, (error, model) => {
      if (error) {
        console.log(error);
        return res.status(500).send({ message: error.message });
      } else if (!model) {
        return res.status(404).send();
      } else {
        return res.status(200).send({ message: `Receipt ${id} removed` });
      }
    });
  };
}

export default ReceiptsController;
