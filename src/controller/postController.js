const Post = require("../models/postModel");
const Suggestion = require("../models/suggestionModel");
const Expert = require("../models/expertModel");

const fs = require("fs");
const path = require("path");
const UserTypes = require("../enum/UserTypes");
const { log } = require("console");

exports.getAllPosts = async (req, res, next) => {
  try {
    const [result, fieldData] = await Post.fetchAll();
    const posts = result.map((post) => ({
      id: post.id,
      title: post.title,
      date: post.date,
      description: post.description,
      userId: post.userId,
      userName: post.userName,
      category: post.category,
      anonymity: post.anonymity,
      status: post.status,
    }));
    res.setHeader("Content-Type", "application/json");
    const response = {
      message: "fetch successfully.",
      data: posts,
    };
    res.status(200).send(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

exports.getPostsByCategory = async (req, res, next) => {
  const phoneNumber = req.params.phoneNumber;

  try {
    const [result1, fieldData1] = await Expert.findByPhoneNumber(phoneNumber);
    if (result1.length === 0) {
      return res.status(400).json({
        message: "Error in Fetching posts.",
      });
    } else {
      const category = result1[0].category;
      const [result, fieldData] = await Post.fetchByCategory(category);
      const posts = result.map((post) => ({
        id: post.id,
        title: post.title,
        date: post.date,
        description: post.description,
        userId: post.userId,
        userName: post.userName,
        category: post.category,
        anonymity: post.anonymity,
        status: post.status,
      }));
      res.setHeader("Content-Type", "application/json");
      const response = {
        message: "fetch successfully.",
        data: posts,
      };
      res.status(200).send(response);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

exports.getPost = async (req, res, next) => {};

exports.getMyPosts = async (req, res, next) => {};

exports.getAllActivePosts = async (req, res, next) => {
  try {
    const [result, fieldData] = await Post.fetchAllActive();
    const posts = result.map((post) => ({
      id: post.id,
      title: post.title,
      date: post.date,
      description: post.description,
      userId: post.userId,
      userName: post.userName,
      category: post.category,
      anonymity: post.anonymity,
      status: post.status,
    }));
    res.setHeader("Content-Type", "application/json");
    const response = {
      message: "fetch successfully.",
      data: posts,
    };
    res.status(200).send(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occurred during fetching posts" });
  }
};

exports.addPost = async (req, res, next) => {
  if (req.userData.userType === UserTypes.USER) {
    try {
      const { title, date, description, userId, userName, category, anonymity } = req.body;
      if (!title || !date || !description || !userId || !userName || !category || !anonymity) {
        return res.status(400).json({ error: "All fields and file are required." });
      }

      const post = new Post("", title, date, description, userId, userName, category, anonymity);

      await post.save();

      res.status(201).json({
        status: 201,
        message: "Post added successfully.",
      });
    } catch (err) {
      res.status(500).json({ message: "An error occurred during adding post" });
      console.error(err.message);
    }
  } else {
    return res.status(401).json({
      message: "Unauthorized!",
    });
  }
};

// exports.removePost = async (req, res, next) => {};
// exports.updatePost = async (req, res, next) => {};

exports.addSuggestions = async (req, res, next) => {
  if (req.userData.userType === UserTypes.EXPERT) {
    try {
      const { postId, expertId, parentId, date, content, expertName } = req.body;

      const suggestion = new Suggestion("", postId, expertId, parentId, date, content, expertName);

      await suggestion.save();

      res.status(201).json({
        status: 201,
        message: "Suggestion added successfully.",
        data: suggestion,
      });
    } catch (err) {
      console.error(err.message);
    }
  } else {
    return res.status(401).json({
      message: "Unauthorized!",
    });
  }
};

exports.getSuggestions = async (req, res, next) => {
  const postId = req.params.postId;
  let [suggestions, suggFieldData] = await Suggestion.fetchSuggestions(postId);
  let [replies, replyFieldData] = await Suggestion.fetchReplySuggestions(postId);

  suggestions.forEach((suggestion) => {
    suggestion.replies = replies.filter((reply) => reply.parentId === suggestion.id);
  });

  res.setHeader("Content-Type", "application/json");
  const response = {
    message: "fetch successfully.",
    data: suggestions,
  };
  res.status(200).send(response);
};
