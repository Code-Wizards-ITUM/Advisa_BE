// const express = require("express");

// // const uploadImg=require('../config/uploadImg')
// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, file, cd) {
//     cd(null, "./uploads/");
//   },
//   filename: function (req, file, cd) {
//     cd(null, "expert" + file.originalname);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === "image/png") {
//     //accept
//     cb(null, true);
//   } else {
//     //reject
//     cb(null, false);
//   }
// };

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5,
//   },
//   fileFilter:fileFilter
// });

// const router = express.Router();



// router.get("/", (req, res) => {
//   res.send("This is expert");
// });
// router.post("/", upload.single("expertImage"), (req, res, next) => {
//   console.log(req.file);
//   res.send("req received"+req.file.path);
// });

// module.exports = router;
