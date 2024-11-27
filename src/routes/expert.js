const express = require("express");

const router = express.Router();
const upload = require('../config/fileUpload');
const blogController = require("../controller/blogController");
const expertController = require("../controller/expertController");
const checkAuth=require('../config/check-auth')
const postController =require("../controller/postController");


router.put('/blog',checkAuth, upload.single('file'), blogController.updateBlog);

router.post("/blog",checkAuth,  upload.single('file'),blogController.addBlog);

router.delete("/deleteBlog", checkAuth, blogController.deleteMyBlog);
router.get("/getPosts/:phoneNumber",checkAuth, postController.getPostsByCategory);

router.get("/getSuggestions/:postId",checkAuth, postController.getSuggestions);
router.post("/addSuggestions",checkAuth, postController.addSuggestions);


router.get("/getBlogs",checkAuth, blogController.getAllActiveBlogs);
router.put('/updateProfilePicture',checkAuth, upload.single('profileImage'), expertController.addProfilePicture);

module.exports = router;
