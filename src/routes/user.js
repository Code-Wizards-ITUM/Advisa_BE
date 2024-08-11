const express = require("express");

const router = express.Router();

const userController = require("../controller/user");

router.get("/:mobileNo", userController.getUser);
router.get("/", userController.getUsers);
router.post("/add", userController.addUser);

module.exports = router;