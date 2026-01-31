const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt');
const e = require('express');
const candidateSchema = new mongoose.Schema({
    name: { type: String, require: true },
    age: { type: Number, require: true },
    candidateId: { type: String, require: true, unique: true },
     election: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Election",
    required: true
  },

  votes: { type: Number, default: 0 }

})
module.exports = mongoose.model('candidates', candidateSchema);