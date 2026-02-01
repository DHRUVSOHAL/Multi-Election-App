const mongoose = require('mongoose');

const ElectionSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  electionId: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Election', ElectionSchema);
