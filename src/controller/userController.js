require("dotenv").config();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

exports.getUsers = async (req, res, next) => {
  try {
    const [result, fieldData] = await User.fetchAll();
    res.setHeader("Content-Type", "application/json");
    const response = {
      message: "fetch successfully.",
      count: result.length,
      data: result,
    };
    res.status(200).send(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

exports.addUser = async (req, res, next) => {
  try {
    const [result, fieldData] = await User.findById(req.body.mobileNumber);
    if (result.length >= 1) {
      return res.status(409).json({
        message: "mobile already exist",
      });
    }
    const hash = await bcrypt.hash(req.body.password, 10);

    const user = new User(req.body.mobileNumber, req.body.email, req.body.name, hash);
    await user.save();

    res.status(201).json({
      message: "Added successfully.",
      data: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
    // res.send(err.sqlMessage);
  }
};

exports.getUser = async (req, res, next) => {
  const mobile_number = req.params.mobileNo;
  try {
    const [result, fieldData] = await User.findById(mobile_number);
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.updateUser=async(req,res,next)=>{}
exports.deleteUser=async(req,res,next)=>{}
