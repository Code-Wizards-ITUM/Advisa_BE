const db = require("../config/db");
const ExpertStatus = require("../enum/ExpertStatus");

module.exports = class Expert {
  constructor(
    phoneNumber,
    email,
    name,
    password,
    category,
    verifiDocument,
    profileImage,
    bio,
    status = "pending"
  ) {
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.name = name;
    this.password = password;
    this.category = category;
    this.status = status;
    this.bio = bio;
    this.verifiDocument = verifiDocument;
    this.profileImage = profileImage;
  }
  save() {
    return db.execute(
      "INSERT INTO experts (phoneNumber, name, email, category, password,bio, profileImage, verifiDocument, status) VALUES(?,?,?,?,?,?,?,?,?);",
      [
        this.phoneNumber,
        this.name,
        this.email,
        this.category,
        this.password,
        this.bio,
        this.profileImage,
        this.verifiDocument,
        this.status,
      ]
    );
  }

  update() {
    return db.execute(
      "UPDATE experts SET name=?, email=?, category=?, password=?,bio=?, profileImage=?, verifiDocument=?, status=? WHERE phoneNumber=? VALUES(?,?,?,?,?,?,?,?,?);",
      [
        this.name,
        this.email,
        this.category,
        this.password,
        this.bio,
        this.profileImage,
        this.verifiDocument,
        this.status,
        this.phoneNumber,
      ]
    );
  }

  static fetchAll() {
    return db.execute("SELECT * FROM experts");
  }

  static findByPhoneNumber(phoneNumber) {
    return db.execute("SELECT * FROM experts WHERE phoneNumber=?", [phoneNumber]);
  }

  static getEmail(phoneNumber) {
    return db.execute("SELECT email FROM experts WHERE phoneNumber=?", [phoneNumber]);
  }

  static login(phoneNumber) {
    return db.execute("SELECT phoneNumber,password,name,email FROM experts WHERE phoneNumber=? AND status = ?", [
      phoneNumber,ExpertStatus.ACTIVE,
    ]);
  }

  static fetchAllActive() {
    return db.execute("SELECT * FROM experts WHERE status=?", [
      ExpertStatus.ACTIVE,
    ]);
  }

  static fetchAllRemoved() {
    return db.execute("SELECT * FROM experts WHERE status=?", [
      ExpertStatus.REMOVED,
    ]);
  }

  static fetchAllNewRequests() {
    return db.execute("SELECT * FROM experts WHERE status=?", [
      ExpertStatus.PENDING,
    ]);
  }

  static changeStatus(phoneNumber, status) {
    return db.execute("UPDATE experts SET status=? WHERE phoneNumber=?", [status, phoneNumber]);
  }

  static addProfilePicture(phoneNumber, profileImage) {
    return db.execute("UPDATE experts SET profileImage=? WHERE phoneNumber=?", [profileImage, phoneNumber]);
  }
};
