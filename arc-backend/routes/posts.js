const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Post = require("../models/Post");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/", authMiddleware, async (req, res) => {
  const { content } = req.body;
  try {
    const newPost = new Post({ user: req.user.id, content });
    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
