/**
 * Project: A.R.C. Web Application
 * Student: Safia Nassiri
 * Post Model with Comments and Likes
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user", // Must match User model name exactly
    required: true,
  },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user", // Must match User model name exactly
    required: true,
  },
  content: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "user" }],
  comments: [CommentSchema],
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("post", PostSchema);
