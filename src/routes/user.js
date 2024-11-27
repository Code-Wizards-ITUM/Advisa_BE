const express = require("express");

const router = express.Router();

const userController = require("../controller/userController");
const expertController = require("../controller/expertController");
const postController = require("../controller/postController");
const blogController = require("../controller/blogController");
const checkAuth=require('../config/check-auth')

router.get("/getBlogs",checkAuth, blogController.getAllActiveBlogs);

router.get("/getActiveExperts",checkAuth, expertController.getAllActive);

router.get("/getExpert/:phoneNumber",checkAuth, expertController.getExpert);

router.post("/addPost",checkAuth, postController.addPost);
router.get("/getPosts",checkAuth, postController.getAllPosts);
// router.delete("/removePost",checkAuth,postController.removePost)




module.exports = router;