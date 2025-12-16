/**
 * Project: A.R.C. Web Application
 * Student: Safia Nassiri
 * Post Routes
 */

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Post = require("../models/Post");

// GET all posts, optionally filtered by forum
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { forum } = req.query;
    const filter = {};
    if (forum && forum !== "All") filter.forum = forum;

    const posts = await Post.find(filter)
      .sort({ date: -1 })
      .populate("user", "username avatar") // post author
      .populate("comments.user", "username avatar"); // comment authors

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// CREATE a new post
router.post("/", authMiddleware, async (req, res) => {
  const { content, forum } = req.body;
  if (!content || content.trim() === "") {
    return res.status(400).json({ msg: "Post content is required" });
  }

  try {
    const newPost = new Post({
      user: req.user.id,
      content: content.trim(),
      forum: forum || "General Discussion",
    });

    const post = await newPost.save();
    await post.populate("user", "username avatar"); // <-- include avatar here
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// DELETE a post
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    if (post.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "User not authorized" });

    await post.deleteOne();
    res.json({ msg: "Post removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// LIKE/UNLIKE a post
router.put("/like/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const likeIndex = post.likes.findIndex(
      (like) => like.toString() === req.user.id
    );
    if (likeIndex > -1) post.likes.splice(likeIndex, 1);
    else post.likes.unshift(req.user.id);

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ADD comment
router.post("/comment/:id", authMiddleware, async (req, res) => {
  const { content } = req.body;
  if (!content || content.trim() === "")
    return res.status(400).json({ msg: "Comment content is required" });

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    post.comments.unshift({ user: req.user.id, content: content.trim() });
    await post.save();

    await post.populate("comments.user", "username avatar"); // populate avatar
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// DELETE comment
router.delete("/comment/:id/:comment_id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const comment = post.comments.id(req.params.comment_id);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });
    if (comment.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "User not authorized" });

    comment.remove();
    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
