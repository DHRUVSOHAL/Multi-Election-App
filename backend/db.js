const mongoose = require('mongoose');

// 🔥 ADD THIS LINE
require('dns').setDefaultResultOrder('ipv4first');

const localURL = process.env.MongoDB_URL || "mongodb://127.0.0.1:27017/voting_app2";

mongoose.connect(localURL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

module.exports = mongoose;