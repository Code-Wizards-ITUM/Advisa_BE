const Blog = require("../models/blogModel");
const Expert = require("../models/expertModel");
const fs = require("fs");
const path = require("path");
const BlogStatus = require("../enum/BlogStatus");
const mailer = require("../config/mail");
const ExpertStatus = require("../enum/ExpertStatus");

exports.addProfilePicture = async (req, res, next) => {
  if (req.userData.userType === UserTypes.EXPERT) {
    const phoneNumber = req.body.phoneNumber;
    try {
      const [result, fieldData] = await Expert.findByPhoneNumber(phoneNumber);
      if (result.length > 0) {
        if (req.file) {
          if (result[0].blogImage) {
            const oldFilePath = path.join(
              __dirname,
              "../../",
              "uploads",
              path.basename(result[0].blogImage)
            );
            fs.unlink(oldFilePath, (err) => {
              if (err) {
                console.error("Failed to delete old file:", err);
              } else {
                console.log("Old file deleted successfully.");
              }
            });
          }

          await Expert.addProfilePicture(phoneNumber, req.file.filename);

          res.status(200).json({
            status: 200,
            message: "Profile Picture updated successfully!",
            data: blog,
          });
        }
      } else {
        return res.status(404).json({
          status: 404,
          message: "Profile not found.",
        });
      }
    } catch (err) {
      console.log("Error:", err.message);
      if (req.file) {
        const filePath = path.join(
          __dirname,
          "../../",
          "uploads",
          path.basename(req.file.filename)
        );
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Failed to delete uploaded file after error:", unlinkErr);
          } else {
            console.log("Uploaded file deleted successfully after error.");
          }
        });
      }
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


exports.getAllActive=async(req,res,next)=>{
  try {
    const [result, fieldData] = await Expert.fetchAllActive();
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
}

exports.getExpert=async(req,res,next)=>{
  const phoneNumber = req.params.phoneNumber;
  try {
    const [result, fieldData] = await Expert.findByPhoneNumber(phoneNumber);
    res.setHeader("Content-Type", "application/json");
    const response = {
      message: "fetch successfully.",
      data: result[0],
    };
    res.status(200).send(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
}
