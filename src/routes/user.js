const express = require("express");

const router = express.Router();

const userController = require("../controller/user");
const checkAuth=require('../config/check-auth')

router.get("/:mobileNo", userController.getUser);
router.get("/",checkAuth, userController.getUsers);
router.post("/add", userController.addUser);

router.post("/login", userController.login);
module.exports = router;