// scripts/fixComments.js
require("dotenv").config(); // load .env
const mongoose = require("mongoose");
const Post = require("../models/Post");

async function fixComments() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB!");

    const posts = await Post.find({});
    for (const post of posts) {
      let changed = false;
      for (const comment of post.comments) {
        // convert string IDs to ObjectId
        if (typeof comment.user === "string") {
          comment.user = mongoose.Types.ObjectId(comment.user);
          changed = true;
        }
      }
      if (changed) await post.save();
    }

    console.log("All comments fixed!");
    await mongoose.disconnect();
  } catch (err) {
    console.error("Error:", err);
  }
}

fixComments();
