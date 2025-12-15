/**
 * Project: A.R.C. Web Application
 * Student: Safia Nassiri
 * Post Model with Comments, Likes, and Forum Categories
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  content: { type: String, required: true },
  forum: {
    type: String,
    default: "General Discussion",
    enum: [
      "General Discussion",
      "Looking for Group (LFG)",
      "Path of Exile",
      "Death Stranding",
      "Off-Topic",
    ],
  },
  likes: [{ type: Schema.Types.ObjectId, ref: "user" }],
  comments: [CommentSchema],
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("post", PostSchema);
