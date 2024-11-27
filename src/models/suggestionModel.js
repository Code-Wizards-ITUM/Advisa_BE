const db = require("../config/db");

module.exports = class Suggestion {
  constructor(id, postId, expertId, parentId, date, content, expertName) {
    this.id = id;
    this.postId = postId;
    this.expertId = expertId;
    this.parentId = parentId;
    this.date = date;
    this.content = content;
    this.expertName = expertName;
  }
  save() {
    return db.execute(
      "INSERT INTO suggestions (id,postId,expertId,parentId,date,content,expertName) VALUES (UUID(),?,?,?,?,?,?)",
      [this.postId, this.expertId, this.parentId, this.date, this.content, this.expertName]
    );
  }

  static fetchSuggestions(postId) {
    return db.execute(
      "SELECT * FROM suggestions WHERE postId = ? AND parentId IS NULL ORDER BY date DESC",
      [postId]
    );

  }
  static fetchReplySuggestions(postId) {
    return db.execute("SELECT * FROM suggestions WHERE postId = ? AND parentId IS NOT NULL ORDER BY date DESC", [postId]);
  }
};
