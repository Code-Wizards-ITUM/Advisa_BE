const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

const adminRoutes = require("./src/routes/admin");
const userRoutes = require("./src/routes/user");
const expertRoutes = require("./src/routes/expert");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/expert", expertRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
