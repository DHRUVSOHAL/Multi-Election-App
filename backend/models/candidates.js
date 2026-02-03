const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },

  candidateId: { type: String, required: true, unique: true },

  election: {
    type: String,
    required: true
  },

  votes: { type: Number, default: 0 }
});

module.exports = mongoose.model('Candidate', CandidateSchema);
