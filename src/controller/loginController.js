require("dotenv").config();
const User = require("../models/userModel");
const Expert = require("../models/expertModel");
const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const UserTypes = require("../enum/UserTypes");

exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        console.log("exp");
        return res.status(401).json({ message: "Token is invalid or expired" });
      }
      res.status(200).json({
        status: 200,
        message: "Verification Success", // Assuming the role is stored in the token payload
      });
    });
  } catch (error) {
    return res.status(401).json({
      message: "Auth Failed!",
    });
  }
};

function findUser(phoneNumber) {
  return Promise.all([
    User.login(phoneNumber),
    Admin.login(phoneNumber),
    Expert.login(phoneNumber),
  ]);
}

exports.login = (req, res, next) => {
  findUser(req.body.phoneNumber)
    .then(([user, admin, expert]) => {
      let userData = null;
      let userType = null;
      let name = null;
      let email = null;

      if (user[0].length > 0) {
        userData = user[0][0];
        userType = UserTypes.USER;
        name = user[0][0].userName;
        email=user[0][0].email;
      } else if (admin[0].length > 0) {
        userData = admin[0][0];
        userType = UserTypes.ADMIN;
        name = admin[0][0].name;
        email=admin[0][0].email;
      } else if (expert[0].length > 0) {
        userData = expert[0][0];
        userType = UserTypes.EXPERT;
        name = expert[0][0].name;
        email=expert[0][0].email;
      }

      if (!userData) {
        return res.status(401).json({
          message: "Auth failed, No user found",
        });
      }

      // Compare password using bcrypt
      bcrypt.compare(req.body.password, userData.password, (err, result) => {
        if (err || !result) {
          return res.status(401).json({
            message: "Password is incorrect.",
          });
        }

        // Generate JWT token with user type
        const token = jwt.sign(
          {
            phoneNumber: req.body.phoneNumber,
            userType: userType,
            name: name,
            email:email,
          },
          process.env.JWT_KEY,
          { expiresIn: "23h" }
        );

        return res.status(200).json({
          message: "Auth successful",
          token: token,
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "An error occurred during login" });
    });
};
