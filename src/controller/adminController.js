const Blog = require("../models/blogModel");
const Expert = require("../models/expertModel");
const fs = require("fs");
const path = require("path");
const ExpertStatus = require("../enum/ExpertStatus");
const mailer = require("../config/mail");
const UserTypes = require("../enum/UserTypes");

exports.approveExpert = async (req, res, next) => {
  if (req.userData.userType === UserTypes.ADMIN) {
    const phoneNumber = req.body.phoneNumber;
    try {
      const [result, fieldData] = await Expert.findByPhoneNumber(phoneNumber);
      if (result.length === 0) {
        return res.status(409).json({
          message: "Error in Approve Request.",
        });
      } else {
        await Expert.changeStatus(phoneNumber, ExpertStatus.ACTIVE);
        const email = result[0].email;
        const subject = "Registration Approved - Welcome to Advisa!";
        const body = `Dear ${result[0].name},<br><br>We are pleased to inform you that your registration for the Advisa system has been successfully approved. Welcome aboard!
          You can now log in using your mobile number and password.Please keep your login details secure and do not share them with anyone. If you have any questions or need assistance, feel free to reach out to our support team.<br><br>Thank you for joining us, and we look forward to serving you!
          <br><br>Best regards,<br>The Advisa Team.`;
        mailer.sendEmail(email, subject, body);
        res.status(200).json({
          message: "Request Approved!",
        });
      }
    } catch (err) {
      res.status(500).json({
        message: err,
      });
    }
  } else {
    return res.status(401).json({
      message: "Unauthorized!",
    });
  }
};

exports.rejectExpert = async (req, res, next) => {
  if (req.userData.userType === UserTypes.ADMIN) {
    const phoneNumber = req.body.phoneNumber;
    try {
      const [result, fieldData] = await Expert.findByPhoneNumber(phoneNumber);
      if (result.length === 0) {
        return res.status(409).json({
          message: "Error in Reject Request.",
        });
      } else {
        await Expert.changeStatus(phoneNumber, ExpertStatus.REMOVED);
        const email =result[0].email;
        const subject = "Registration Request Rejection.";
        const body = `Dear ${result[0].name},<br><br>Thank you for your interest in the Advisa system. We appreciate the time and effort you took to complete your registration.<br><br>Unfortunately, we regret to inform you that your registration request has not been approved at this time. This decision may be due to [briefly explain reason, e.g., incomplete information, failure to meet eligibility criteria, etc.].<br><br>If you believe this decision was made in error or if you have any questions, please do not hesitate to contact our support team. We are here to assist you and provide any guidance you may need.<br><br>Thank you for your understanding.<br><br>Best regards,<br>The Advisa Team.`;
        mailer.sendEmail(email, subject, body);
        console.log('send to'+email);
        res.status(200).json({
          message: "Request Rejected!",
        });
      }
    } catch (err) {
      res.status(500).json({
        message: err,
      });
    }
  } else {
    return res.status(401).json({
      message: "Unauthorized!",
    });
  }
};

exports.getAllRemoved = async (req, res, next) => {
  if (req.userData.userType === UserTypes.ADMIN) {
    try {
      const [result, fieldData] = await Expert.fetchAllRemoved();
      res.setHeader("Content-Type", "application/json");
      const response = {
        message: "fetch successfully.",
        data: result,
      };
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    }
  } else {
    return res.status(401).json({
      message: "Unauthorized!",
    });
  }
};

exports.getAllPending = async (req, res, next) => {
  if (req.userData.userType === UserTypes.ADMIN) {
    try {
      const [result, fieldData] = await Expert.fetchAllNewRequests();
      res.setHeader("Content-Type", "application/json");
      const response = {
        message: "fetch successfully.",
        data: result,
      };
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    }
  } else {
    return res.status(401).json({
      message: "Unauthorized!",
    });
  }
};
