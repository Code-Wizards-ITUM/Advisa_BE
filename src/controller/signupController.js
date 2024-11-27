const User = require("../models/userModel");
const Admin = require("../models/adminModel");
const Expert = require("../models/expertModel");
const bcrypt = require("bcrypt");
const ExpertStatus = require("../enum/ExpertStatus");
const mailer = require("../config/mail");
const fs = require("fs");
const path = require("path");

exports.userSignup = async (req, res, next) => {
  try {
    const [result, fieldData] = await User.findByPhoneNumber(req.body.phoneNumber);
    if (result.length >= 1) {
      return res.status(409).json({
        message: "User already exist",
      });
    }
    const hash = await bcrypt.hash(req.body.password, 10);

    const user = new User(req.body.phoneNumber, req.body.email, req.body.userName, hash);
    await user.save();
    const email = req.body.email;
    const subject = "Welcome to Advisa! Your Registration is Complete.";
    const body = `Dear ${req.body.userName},<br><br>
    Thank you for registering with Advisa! We are thrilled to have you as part of our community. Now you can log into app using you mobile number that you used to register and password.If you have any questions or need assistance, feel free to reach out to our support team at advisaconsultant@gmail.com.<br><br>Thank you for choosing Advisa. We look forward to supporting you on your journey!<br><br>Best regards,<br>The Advisa Team`;
    mailer.sendEmail(email, subject, body);
    res.status(201).json({
      status: 201,
      message: "Added successfully.",
      data: user,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      error: err,
    });
  }
};

exports.expertSignup = async (req, res, next) => {
  try {
    const [result, fieldData] = await Expert.findByPhoneNumber(req.body.phoneNumber);
    if (result.length >= 1) {
      if(result[0].status===ExpertStatus.ACTIVE){
        return res.status(409).json({
          message: "You already have an account.",
        });
      }else if(result[0].status===ExpertStatus.PENDING){
        return res.status(409).json({
          message: "You request already under admin review.",
        });
      }else if(result[0].status===ExpertStatus.REMOVED){
        return res.status(409).json({
          message: "You already have an account. But Removed by Admin. Please Contact Admin",
        });
      }
      
    }
    const hash = await bcrypt.hash(req.body.password, 10);
    const expert = new Expert(
      req.body.phoneNumber,
      req.body.email,
      req.body.name,
      hash,
      req.body.category,
      req.file.filename,
      "",
      // req.profileImage.filename,
      req.body.bio,
      ExpertStatus.PENDING
    );
    
    await expert.save();

    const email = req.body.email;
    const subject = "Welcome to Advisa! Your Registration is Under Review.";
    const body = `Dear ${req.body.name},<br><br>
    Thank you for registering with Advisa! We are pleased to inform you that your details have been successfully added to our system.<br><br>
    <br><br>Our admin team will review your submitted information to ensure it meets our standards. Once your profile is approved, you will receive a confirmation email, allowing you to log in to the system using the credentials provided above.
    <br><br> If you have any questions or need further assistance, please don't hesitate to reach out to our support team at advisaconsultant@gmail.com.<br><br>
    Thank you for choosing Advisa. We look forward to supporting you as you connect with clients in your field!<br><br>
    Best regards,<br>The Advisa Team`;
    mailer.sendEmail(email, subject, body);

    res.status(201).json({
      status: 201,
      message: "Added successfully.",
      data: expert,
    });
  } catch (err) {
    console.log(err.message);

    if (req.file) {
      const filePath = path.join(
        __dirname,
        "../../",
        "uploads",
        path.basename(req.file.filename)
      );
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting verify file:", unlinkErr.message);
        }
      });
    }
    // if (req.profileImage) {
    //   const filePath = path.join(__dirname, "../../", "uploads", path.basename(req.profileImage.filename));
    //   fs.unlink(filePath, (unlinkErr) => {
    //     if (unlinkErr) {
    //       console.error("Error deleting profile file:", unlinkErr.message);
    //     }
    //   });
    // }
    res.status(500).json({
      message: "Error placing request. Please try again.",
      details: err.message,
    });
  }
};

exports.adminSignup = async (req, res, next) => {
  try {
    const [result, fieldData] = await Admin.findByPhoneNumber(req.body.phoneNumber);
    if (result.length >= 1) {
      return res.status(409).json({
        message: "User already exist",
      });
    }
    const hash = await bcrypt.hash(req.body.password, 10);

    const admin = new Admin(req.body.phoneNumber, req.body.email, req.body.name, hash);
    await admin.save();

    res.status(201).json({
      message: "Added successfully.",
      data: admin,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
    // res.send(err.sqlMessage);
  }
};
