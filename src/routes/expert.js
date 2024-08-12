const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("This is expert");
});
router.post("/", (req, res, next) => {
  res.send("req received");
});

module.exports = router;
