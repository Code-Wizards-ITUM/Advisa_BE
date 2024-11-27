const express = require("express");

const router = express.Router();

const signupController = require("../controller/signupController");
const upload = require('../config/fileUpload');

router.post("/user", signupController.userSignup);
router.post("/admin", signupController.adminSignup);
router.post("/expert",upload.single('verifiDocument'), signupController.expertSignup);

module.exports = router;
