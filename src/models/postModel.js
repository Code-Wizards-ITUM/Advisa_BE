const db = require("../config/db");
const PostStatus = require("../enum/PostStatus");

module.exports = class Post {
  constructor(id, title, date, description, userId,userName, category, anonymity, status = "active") {
    this.id = id;
    this.title = title;
    this.date = date;
    this.description = description;
    this.userId = userId;
    this.userName = userName;
    this.category = category;
    this.anonymity = anonymity;
    this.status = status;
  }
  save() {
    return db.execute(
      "INSERT INTO posts (id,title,date,description,userId,userName,category,anonymity,status)VALUES (UUID(),?,?,?,?,?,?,?,?)",
      [
        this.title,
        this.date,
        this.description,
        this.userId,
        this.userName,
        this.category,
        this.anonymity,
        this.status,
      ]
    );
  }
  static fetchAll() {
    return db.execute("SELECT * FROM posts ORDER BY date DESC");
  }

  static fetchAllActive() {
    return db.execute("SELECT * FROM posts WHERE status=? ORDER BY date DESC", [PostStatus.ACTIVE]);
  }

  static fetchByCategory(category) {
    return db.execute("SELECT * FROM posts WHERE category=? AND status=? ORDER BY date DESC", [
      category,
      PostStatus.ACTIVE,
    ]);
  }

  static findById(id) {
    return db.execute("SELECT * FROM posts WHERE id=?", [id]);
  }

  static changeStatus(id, status) {
    return db.execute("UPDATE posts SET status=? WHERE id=?", [status, id]);
  }
};
