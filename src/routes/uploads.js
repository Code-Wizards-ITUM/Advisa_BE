const express = require("express");

const router = express.Router();
const upload = require('../config/fileUpload');
const blogController = require("../controller/blogController");




// router.post("/blog",upload.single('file'), blogController.addBlog);
// router.put("/blog/update",fileUploadMiddleware, blogController.updateBlog);
// router.post("/admin", signupController.adminSignup);


module.exports = router;