const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const ElectionSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  electionId: { type: String, required: true, unique: true },
  isActive: { type: Boolean , default: true },
  password: { type: String, required: true } //for admin login
  
});

ElectionSchema.pre('save', async function () {//next is not defined because arrow function not used
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
module.exports = mongoose.model('Election', ElectionSchema);
