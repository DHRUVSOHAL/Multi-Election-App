const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const voterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true, enum: ['M','F','other'] },

  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  eligibleElections: [
    {
      election: {
        type: String,
        required: true
      },
      hasVoted: {
        type: Boolean,
        default: false
      }
    }
  ]
});
voterSchema.pre('save', async function () {//next is not defined because arrow function not used
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
module.exports = mongoose.model('voters', voterSchema);