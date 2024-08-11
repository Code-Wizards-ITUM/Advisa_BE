const User = require("../models/user");

exports.getUsers = (req, res, next) => {
  User.fetchAll()
    .then(([result, fieldData]) => {
      res.setHeader("Content-Type", "application/json");
      //   res.send(JSON.stringify(result));
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.addUser = (req, res, next) => {
  const mobile_number = req.body.mobileNumber;
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const user = new User(mobile_number, email, name, password);

  user
    .save()
    .then(() => {
      res.send("Added successfully.");
    })
    .catch((err) => {
      console.log(err);
      res.send(err.sqlMessage);
    });
};

exports.getUser = (req, res, next) => {
  const mobile_number = req.params.mobileNo;
  User.findById(mobile_number)
    .then(([result, fieldData]) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
};
