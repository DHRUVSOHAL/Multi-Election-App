const mongoose = require('mongoose');

const ElectionSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  electionId: { type: String, required: true, unique: true },
  isActive: { type: Boolean , default: true },
  password: { type: String, required: true } //for admin login
  
});

module.exports = mongoose.model('Election', ElectionSchema);
