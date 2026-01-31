const mongoose = require('mongoose');

const localURL = "mongodb://127.0.0.1:27017/voting_app2";

mongoose.connect(localURL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

module.exports = mongoose;
