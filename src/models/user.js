const db = require("../config/db");

module.exports = class User {
  constructor(mobile_number, email, name, password) {
    this.mobile_number = mobile_number;
    this.email = email;
    this.name = name;
    this.password = password;
  }
  save() {
    return db.execute("INSERT INTO users (mobile_number,email,name,password) VALUES (?,?,?,?)", [
      this.mobile_number,
      this.email,
      this.name,
      this.password,
    ]);
  }
  static fetchAll() {
    return db.execute("SELECT * FROM users");
  }

  static findById(id) {
    return db.execute("SELECT * FROM users WHERE mobile_number=?",[id]);
  }
};
