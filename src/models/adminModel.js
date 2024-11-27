const db = require("../config/db");

module.exports = class Admin {
  constructor(phoneNumber, email, name, password) {
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.name = name;
    this.password = password;
  }
  save() {
    return db.execute(
      "INSERT INTO admins (phoneNumber,email,name,password) VALUES (?,?,?,?)",
      [this.phoneNumber, this.email, this.name,this.password]
    );
  }
  static fetchAll() {
    return db.execute("SELECT * FROM admins");
  }

  static findByPhoneNumber(phoneNumber) {
    return db.execute("SELECT * FROM admins WHERE phoneNumber=?", [phoneNumber]);
  }
  static login(phoneNumber) {
    return db.execute("SELECT phoneNumber,password,name,email FROM admins WHERE phoneNumber=?", [phoneNumber]);
  }
  update() {
    return db.execute(
      "UPDATE admins SET email=?,name=?,password=? WHERE phoneNumber=?",
      [this.email, this.name,this.password, this.phoneNumber]
    );
  }
  static delete(phoneNumber) {
    return db.execute("DELETE FROM admins WHERE phoneNumber=?", [phoneNumber]);
  }
};
