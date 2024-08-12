const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const morgan = require("morgan");
const port = 3000;

const adminRoutes = require("./src/routes/admin");
const userRoutes = require("./src/routes/user");
const expertRoutes = require("./src/routes/expert");

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

app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/expert", expertRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  // error.status(404);
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    },
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
