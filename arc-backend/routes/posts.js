/**
 * Project: A.R.C. Web Application
 * Student: Safia Nassiri
 * Post Routes with full CRUD functionality for posts and comments
 */

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Post = require("../models/Post");
const User = require("../models/User");

// @route   GET /api/posts
// @desc    Get all posts with user info (optionally filtered by forum)
// @access  Private
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { forum } = req.query;

    // Build filter object
    const filter = {};
    if (forum && forum !== "All") {
      filter.forum = forum;
    }

    const posts = await Post.find(filter)
      .sort({ date: -1 })
      .populate("user", "username email")
      .populate("comments.user", "username email");

    console.log(
      `Posts fetched: ${posts.length}${forum ? ` (filtered by: ${forum})` : ""}`
    );

    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/posts
// @desc    Create a post
// @access  Private
router.post("/", authMiddleware, async (req, res) => {
  const { content, forum } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ msg: "Post content is required" });
  }

  try {
    console.log(
      "Creating post for user ID:",
      req.user.id,
      "Forum:",
      forum || "General Discussion"
    );

    const newPost = new Post({
      user: req.user.id,
      content: content.trim(),
      forum: forum || "General Discussion",
    });

    const post = await newPost.save();
    console.log("Post saved with ID:", post._id);

    // Populate user info before sending response
    await post.populate("user", "username email");

    console.log("Post created successfully with forum:", post.forum);

    res.json(post);
  } catch (err) {
    console.error("Error creating post:", err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Check if user owns the post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await post.deleteOne();
    res.json({ msg: "Post removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/posts/like/:id
// @desc    Like/Unlike a post
// @access  Private
router.put("/like/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Check if post is already liked by this user
    const likeIndex = post.likes.findIndex(
      (like) => like.toString() === req.user.id
    );

    if (likeIndex > -1) {
      // Unlike: Remove user from likes array
      post.likes.splice(likeIndex, 1);
    } else {
      // Like: Add user to likes array
      post.likes.unshift(req.user.id);
    }

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post("/comment/:id", authMiddleware, async (req, res) => {
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ msg: "Comment content is required" });
  }

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    const newComment = {
      user: req.user.id,
      content: content.trim(),
      date: Date.now(),
    };

    post.comments.unshift(newComment);
    await post.save();

    // Populate user info for the response
    await post.populate("comments.user", "username email");

    console.log("Comment added, first comment user:", post.comments[0].user);

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/posts/comment/:id/:comment_id
// @desc    Delete comment from post
// @access  Private
router.delete("/comment/:id/:comment_id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Find comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    // Check if user owns the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // Remove comment
    post.comments = post.comments.filter(
      (comment) => comment.id !== req.params.comment_id
    );

    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
