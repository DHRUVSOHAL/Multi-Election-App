const mongoose = require('mongoose');
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
module.exports = mongoose.model('voters', voterSchema);