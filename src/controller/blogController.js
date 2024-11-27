const Blog = require("../models/blogModel");
const Expert = require("../models/expertModel");
const fs = require("fs");
const path = require("path");
const BlogStatus = require("../enum/BlogStatus");
const mailer = require("../config/mail");
const UserTypes = require("../enum/UserTypes");

exports.getAllBlogs = async (req, res, next) => {
  try {
    const [result, fieldData] = await Blog.fetchAll();
    const blogs = result.map((blog) => ({
      id: blog.id,
      title: blog.title,
      author: blog.author,
      authorId: blog.authorId,
      date: blog.date,
      blogImage: blog.blogImage,
      content: blog.content,
    }));
    res.setHeader("Content-Type", "application/json");
    const response = {
      message: "fetch successfully.",
      data: blogs,
    };
    res.status(200).send(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

exports.getAllActiveBlogs = async (req, res, next) => {
  // console.log(req.userData);
  try {
    const [result, fieldData] = await Blog.fetchAllActive();
    const blogs = result.map((blog) => ({
      id: blog.id,
      title: blog.title,
      author: blog.author,
      authorId: blog.authorId,
      date: blog.date,
      blogImage: blog.blogImage, // Full URL to access the image
      content: blog.content,
    }));
    res.setHeader("Content-Type", "application/json");
    const response = {
      message: "fetch successfully.",
      data: blogs,
    };
    res.status(200).send(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

exports.getAllRemovedBlogs = async (req, res, next) => {
  if (req.userData.userType === UserTypes.ADMIN) {
    try {
      const [result, fieldData] = await Blog.fetchAllRemoved();
      const blogs = result.map((blog) => ({
        id: blog.id,
        title: blog.title,
        author: blog.author,
        authorId: blog.authorId,
        date: blog.date,
        blogImage: blog.blogImage, // Full URL to access the image
        content: blog.content,
      }));
      res.setHeader("Content-Type", "application/json");
      const response = {
        message: "fetch successfully.",
        data: blogs,
      };
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    }
  } else {
    return res.status(401).json({
      message: "Unauthorized!",
    });
  }
};

exports.getMyBlogs = async (req, res, next) => {
  const id = req.body.authorId;
  try {
    const [result, fieldData] = await Blog.fetchMyBlogs(id);
    const blogs = result.map((blog) => ({
      id: blog.id,
      title: blog.title,
      author: blog.author,
      authorId: blog.authorId,
      date: blog.date,
      blogImage: blog.blogImage, // Full URL to access the image
      content: blog.content,
    }));
    res.setHeader("Content-Type", "application/json");
    const response = {
      message: "fetch successfully.",
      data: blogs,
    };
    res.status(200).send(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

exports.removeBlog = async (req, res, next) => {
  if (req.userData.userType === UserTypes.ADMIN) {
    const blogId = req.body.id;
    const authorId = req.body.authorId;
    const title = req.body.title;
    const [result1, fieldData] = await Expert.getEmail(authorId);
    const email = result1[0].email;
    try {
      const [result, fieldData] = await Blog.findById(blogId);
      if (result.length === 0) {
        return res.status(409).json({
          message: "Error in removing blog.",
        });
      } else {
        await Blog.changeStatus(blogId, BlogStatus.REMOVED);

        const subject = "Notification Regarding the Removal of Your Blog Post.";
        const body = `Dear Consultant,<br><br>We hope this message finds you well. We wanted to inform you that your recent blog post titled "${title}" has been removed from our platform as it did not meet our content guidelines.<br><br>We strive to maintain a positive and respectful environment for all our users, and we encourage everyone to adhere to the community standards set forth. You can review our content policy [here] to understand more about these guidelines.<br><br>If you believe this removal was in error or if you have any questions, please feel free to reach out to us at advisaconsultant@gmail.com, and we’ll be happy to discuss the situation further.<br>We appreciate your understanding and look forward to your future contributions.<br><br><br> Best regards,<br>Admin`;
        mailer.sendEmail(email, subject, body);
        res.status(200).json({
          message: "Blog removed",
        });
      }
    } catch (err) {
      res.status(500).json({
        message: err,
      });
    }
  } else {
    return res.status(401).json({
      message: "Unauthorized!",
    });
  }
};

exports.restoreBlog = async (req, res, next) => {
  if (req.userData.userType === UserTypes.ADMIN) {
    const blogId = req.body.id;
    const authorId = req.body.authorId;
    const title = req.body.title;
    const [result1, fieldData] = await Expert.getEmail(authorId);
    const email = result1[0].email;
    console.log(email);
    try {
      const [result, fieldData] = await Blog.findById(blogId);
      if (result.length === 0) {
        return res.status(409).json({
          message: "Error in restoring blog.",
        });
      } else {
        console.log(authorId);
        await Blog.changeStatus(blogId, BlogStatus.ACTIVE);

        const subject = "Notification Regarding the Restoring of Your Blog Post.";
        const body = `Dear Consultant,<br><br>We hope this message finds you well. We wanted to inform you that your recent blog post titled "${title}" has been removed from our platform as it did not meet our content guidelines.<br><br>We strive to maintain a positive and respectful environment for all our users, and we encourage everyone to adhere to the community standards set forth. You can review our content policy [here] to understand more about these guidelines.<br><br>If you believe this removal was in error or if you have any questions, please feel free to reach out to us at advisaconsultant@gmail.com, and we’ll be happy to discuss the situation further.<br>We appreciate your understanding and look forward to your future contributions.<br><br><br> Best regards,<br>Admin`;
        mailer.sendEmail(email, subject, body);
        res.status(200).json({
          message: "Blog Restored",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err,
      });
    }
  } else {
    return res.status(401).json({
      message: "Unauthorized!",
    });
  }
};

exports.addBlog = async (req, res, next) => {
  if (req.userData.userType === UserTypes.EXPERT) {
    try {
      const { title, author, authorId, date, content } = req.body;
      console.log(title, author, authorId, date, content, req.file);

      if (!title || !author || !authorId || !date || !content || !req.file) {
        return res.status(400).json({ message: "All fields and file are required." });
      }

      // Create a new blog instance
      const blog = new Blog(
        "", // Assuming you are using an auto-generated UUID for the blog ID
        title,
        author,
        authorId,
        date,
        req.file.filename, // Path of the uploaded file
        content
      );

      // Save blog to the database
      await blog.save();

      // Return a successful response
      res.status(201).json({
        status: 201,
        message: "Blog added successfully.",
        data: blog,
      });
    } catch (err) {
      console.error(err.message);

      // If there's an error, delete the uploaded file to avoid unused files
      if (req.file) {
        const filePath = path.join(
          __dirname,
          "../../",
          "uploads",
          path.basename(req.file.filename)
        );
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting file:", unlinkErr.message);
          }
        });
      }
      res.status(500).json({
        error: "Error adding blog. Please try again.",
        details: err.message,
      });
    }
  } else {
    return res.status(401).json({
      message: "Unauthorized!",
    });
  }
};

exports.updateBlog = async (req, res, next) => {
  if (req.userData.userType === UserTypes.EXPERT) {
    const blogId = req.body.id;
    console.log(blogId);
    try {
      const [result, fieldData] = await Blog.findById(blogId);
      if (result.length > 0) {
        const blog = new Blog(
          result[0].id,
          result[0].title,
          result[0].author,
          result[0].authorId,
          result[0].date,
          result[0].blogImage,
          result[0].content,
          result[0].status
        );
        if (req.file) {
          if (blog.blogImage) {
            const oldFilePath = path.join(
              __dirname,
              "../../",
              "uploads",
              path.basename(blog.blogImage)
            );
            fs.unlink(oldFilePath, (err) => {
              if (err) {
                console.error("Failed to delete old file:", err);
              } else {
                console.log("Old file deleted successfully.");
              }
            });
          }
        }
        blog.blogImage = req.file?req.file.filename:blog.blogImage;
        blog.id = blog.id;
        blog.title = req.body.title || blog.title;
        blog.content = req.body.content || blog.content;
        blog.author = req.body.author || blog.author;
        blog.authorId = req.body.authorId || blog.authorId;
        blog.date = req.body.date || blog.date;
        blog.status = req.body.status || blog.status;

        await blog.updateBlog();

        res.status(200).json({
          status: 200,
          message: "Blog updated successfully!",
          data: blog,
        });
      } else {
        return res.status(404).json({
          status: 404,
          message: "Blog not found.",
        });
      }
    } catch (err) {
      console.log("Error:", err.message);
      if (req.file) {
        const filePath = path.join(
          __dirname,
          "../../",
          "uploads",
          path.basename(req.file.filename)
        );
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Failed to delete uploaded file after error:", unlinkErr);
          } else {
            console.log("Uploaded file deleted successfully after error.");
          }
        });
      }
      res.status(500).json({
        error: err.message,
      });
    }
  } else {
    return res.status(401).json({
      message: "Unauthorized!",
    });
  }
};

exports.deleteMyBlog = async (req, res, next) => {
  if (req.userData.userType === UserTypes.EXPERT) {
    const blogId = req.body.id;
    try {
      const [result, fieldData] = await Blog.findById(blogId);
      if (result.length === 0) {
        return res.status(409).json({
          message: "Error in removing blog.",
        });
      } else {
        await Blog.changeStatus(blogId, BlogStatus.DELETED);
        res.status(200).json({
          message: "Blog removed",
        });
      }
    } catch (err) {
      res.status(500).json({
        message: err,
      });
    }
  } else {
    return res.status(401).json({
      message: "Unauthorized!",
    });
  }
};
