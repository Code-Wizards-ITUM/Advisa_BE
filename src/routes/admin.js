const express = require("express");
const blogController = require("../controller/blogController");
const adminController = require("../controller/adminController");
const expertController = require("../controller/expertController");
const checkAuth = require("../config/check-auth");

const router = express.Router();

router.get("/getBlogs", checkAuth, blogController.getAllActiveBlogs);
router.get("/getRemovedBlogs", checkAuth, blogController.getAllRemovedBlogs);
router.delete("/deleteBlog", checkAuth, blogController.removeBlog);
router.put("/restoreBlog", checkAuth, blogController.restoreBlog);




router.post("/approveExpert", checkAuth, adminController.approveExpert);
router.post("/rejectExpert", checkAuth, adminController.rejectExpert);

router.get("/getRejectedExpert", checkAuth, adminController.getAllRemoved);
router.get("/getPendingExperts", checkAuth, adminController.getAllPending);
router.get("/getActiveExperts", checkAuth, expertController.getAllActive);

module.exports = router;
