// const multer = require('multer');
// const path = require('path');

// // File size limit (5 MB)
// const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

// // Set up multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './uploads');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to file name
//   },
// });

// // File filter to allow only specific file types
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|pdf/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);

//   if (extname && mimetype) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only .jpeg, .jpg, .png, and .pdf files are allowed.'));
//   }
// };

// // Initialize multer with storage, file size limit, and file type filtering
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: FILE_SIZE_LIMIT },
//   fileFilter: fileFilter,
// }).single('file');

// // Middleware function to handle multer errors
// const fileUploadMiddleware = (req, res, next) => {
//   upload(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       // Multer-specific errors (e.g., file size limit)
//       return res.status(500).json({ error: `Multer error: ${err.message}` });
//     } else if (err) {
//       // General errors (e.g., invalid file types)
//       return res.status(500).json({ error: `File upload error: ${err.message}` });
//     }
//     next();
//   });
// };

// module.exports = fileUploadMiddleware;

// fileUpload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure storage for both images and PDFs
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to save the uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate unique file name
  },
});

// File type filter for images and PDFs
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only images (JPEG, PNG) and PDFs are allowed."));
  }
};

// Use multer with storage and fileFilter
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },//10MB
  fileFilter: fileFilter,
});


module.exports = upload;
