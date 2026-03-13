const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  age: {
    type: Number,
    required: true
  },

  candidateId: {
    type: String,
    required: true
  },

  electionId: {
    type: String,
    required: true
  },

  votes: {
    type: Number,
    default: 0
  }

});

CandidateSchema.index({ candidateId: 1, electionId: 1 }, { unique: true });

module.exports = mongoose.model('Candidate', CandidateSchema);