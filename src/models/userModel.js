const db = require("../config/db");

module.exports = class User {
  constructor(phoneNumber, email, userName, password) {
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.userName = userName;
    this.password = password;
  }
  save() {
    return db.execute(
      "INSERT INTO users (phoneNumber,email,userName,password) VALUES (?,?,?,?)",
      [this.phoneNumber, this.email, this.userName,this.password]
    );
  }
  static fetchAll() {
    return db.execute("SELECT * FROM users");
  }

  static findByPhoneNumber(phoneNumber) {
    return db.execute("SELECT * FROM users WHERE phoneNumber=?", [phoneNumber]);
  }
  static login(phoneNumber) {
    return db.execute("SELECT phoneNumber,userName,password,email FROM users WHERE phoneNumber=?", [phoneNumber]);
  }
  update() {
    return db.execute(
      "UPDATE users SET email=?,userName=?,password=? WHERE phoneNumber=?",
      [this.email, this.userName, this.password, this.phoneNumber]
    );
  }
  static delete(phoneNumber) {
    return db.execute("DELETE FROM users WHERE phoneNumber=?", [phoneNumber]);
  }
};
