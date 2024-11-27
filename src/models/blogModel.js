const db = require("../config/db");
const BlogStatus = require("../enum/BlogStatus");

module.exports = class Blog {
  constructor(id, title, author,authorId, date,blogImage,content, status = 'active') {
    this.id = id;
    this.title = title;
    this.author = author;
    this.authorId = authorId;
    this.date = date;
    this.blogImage=blogImage;
    this.content=content;
    this.status = status;
  }
  save() {
    return db.execute(
      "INSERT INTO blogs (id,title,author,authorId,date,blogImage,content,status) VALUES (UUID(),?,?,?,?,?,?,?)",
      [this.title, this.author,this.authorId, this.date,this.blogImage,this.content,this.status]
    );
  }
  static fetchAllActive() {
    return db.execute("SELECT * FROM blogs WHERE status=? ORDER BY date DESC",[BlogStatus.ACTIVE]);
  }
  static fetchMyBlogs(id) {
    return db.execute("SELECT * FROM blogs WHERE status=? AND authorId=? ORDER BY date DESC",[BlogStatus.ACTIVE,id]);
  }
  static fetchAllRemoved() {
    return db.execute("SELECT * FROM blogs WHERE status=? ORDER BY date DESC",[BlogStatus.REMOVED]);
  }
  static fetchAll() {
    return db.execute("SELECT * FROM blogs ORDER BY date DESC");
  }

  static findById(id) {
    return db.execute("SELECT * FROM blogs WHERE id=?", [id]);
  }
  updateBlog() {
    return db.execute(
      "UPDATE blogs SET title=?,author=?,authorId=?,date=?,blogImage=?,content=?,status=? WHERE id=?",
      [this.title, this.author,this.authorId, this.date,this.blogImage,this.content,this.status,this.id]
    );
  }
  static changeStatus(id,status) {
    return db.execute(
      "UPDATE blogs SET status=? WHERE id=?",
      [status,id]
    );
  }
  static delete(id) {
    return db.execute("DELETE FROM blogs WHERE id=?", [id]);
  }
};
