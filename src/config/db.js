const mysql = require("mysql2");
require('dotenv').config();

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "advisa",
  password:process.env.DB_PASS,
  dateStrings: true 
});


module.exports=pool.promise();