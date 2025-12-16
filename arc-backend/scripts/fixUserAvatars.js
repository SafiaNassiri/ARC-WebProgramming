require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");

const UPLOADS_DIR = path.join(__dirname, "../uploads/avatars");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function fixAvatars() {
  try {
    const users = await User.find({});
    for (const user of users) {
      if (!user.avatar) {
        // Look for a file in uploads/avatars that matches the username
        const files = fs.readdirSync(UPLOADS_DIR);
        const match = files.find((f) =>
          f.toLowerCase().startsWith(user.username.toLowerCase())
        );
        if (match) {
          user.avatar = `uploads/avatars/${match}`;
          await user.save();
          console.log(`Updated avatar for user: ${user.username}`);
        } else {
          console.log(`No avatar file found for user: ${user.username}`);
        }
      }
    }

    console.log("Finished updating user avatars!");
    mongoose.disconnect();
  } catch (err) {
    console.error("Error:", err);
    mongoose.disconnect();
  }
}

fixAvatars();
