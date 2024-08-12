require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

exports.getUsers = (req, res, next) => {
  User.fetchAll()
    .then(([result, fieldData]) => {
      res.setHeader("Content-Type", "application/json");
      const response = {
        message: "fetch successfully.",
        count: result.length,
        data: result,
      };
      res.status(200).send(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.addUser = (req, res, next) => {
  User.findById(req.body.mobileNumber).then(([result, fieldData]) => {
    if (result.length >= 1) {
      return res.status(409).json({
        message: "mobile already exist",
      });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        } else {
          const user = new User(req.body.mobileNumber, req.body.email, req.body.name, hash);
          user
            .save()
            .then(() => {
              res.status(201).json({
                message: "Added successfully.",
                data: user,
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                error: err,
              });
              // res.send(err.sqlMessage);
            });
        }
      });
    }
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

exports.login = (req, res, next) => {
  User.findById(req.body.mobileNumber)
    .then(([users, fieldData]) => {
      if (users.length < 1) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      bcrypt.compare(req.body.password, users[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              mobileNumber: users[0].mobile_number,
              email: users[0].email,
            },
            process.env.JWT_KEY,
            { expiresIn: '1h'}
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token,
          });
        }
        res.status(401).json({
          message: "Auth failed",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};
