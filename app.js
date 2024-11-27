const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const morgan = require("morgan");
var cors = require('cors');
require('dotenv').config();
const port = process.env.PORT;
const jwt = require('jsonwebtoken');

const adminRoutes = require("./src/routes/admin");
const userRoutes = require("./src/routes/user");
const expertRoutes = require("./src/routes/expert");
const loginRoutes = require("./src/routes/login");
const signupRoutes = require("./src/routes/signup");
const uploadRoutes = require("./src/routes/uploads");
app.use(cors());
app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Requested-With,Origin,Accept, Authorization"
  );
  if (req.method === "OPTION") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});

app.use('/api/uploads', express.static('uploads'));

app.use("/api/login", loginRoutes);
app.use("/api/signup", signupRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/expert", expertRoutes);
app.use("/api/upload", uploadRoutes);


app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


// done
// all signup
// all login


// = admin 
// approve request
// reject request


// ================================
// user

// ================================
// expert