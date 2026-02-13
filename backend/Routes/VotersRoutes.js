const express = require('express');
const router = express.Router();

const Election = require('./../models/Election.js');
const Voter = require('./../models/voters.js');
const Candidate = require('./../models/candidates.js');
const bcrypt = require('bcrypt');

const { jwtAuthMiddleware, generateToken } = require('./../jwt.js');

// TEST ROUTE
router.get('/', (req, res) => {
  res.send("Voters route working");
});

// VOTER LOGIN
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const voter = await Voter.findOne({ username });
    if (!voter) return res.status(404).json({ message: "Voter not found" });

    const isMatch = await bcrypt.compare(password, voter.password);
    if (!isMatch) return res.status(403).json({ message: "Incorrect password" });

    const token = generateToken({ username, role: 'voter' });

    res.status(200).json({ message: "Login successful", token });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GIVE VOTE (VOTER ONLY)
router.put('/giveVote', jwtAuthMiddleware('voter'), async (req, res) => {
  try {
    const username = req.user.username; // SECURE SOURCE
    const { electionId, candidateId } = req.body;

    if (!electionId || !candidateId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const voter = await Voter.findOne({ username });
    if (!voter) return res.status(404).json({ message: "Voter not found" });

    const election = await Election.findOne({ electionId });
    if (!election) return res.status(404).json({ message: "Election not found" });

    if (!election.isActive) {
      return res.status(403).json({ message: "Election is not active" });
    }

    const electionEntry = voter.eligibleElections.find(
      e => e.election === electionId
    );

    if (!electionEntry) {
      return res.status(403).json({ message: "Not eligible for this election" });
    }

    if (electionEntry.hasVoted) {
      return res.status(403).json({ message: "Already voted" });
    }

    const candidate = await Candidate.findOne({ candidateId, electionId });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    await Candidate.updateOne(
      { candidateId, electionId },
      { $inc: { votes: 1 } }
    );

    electionEntry.hasVoted = true;
    electionEntry.votedAt = new Date();

    await voter.save();

    res.status(200).json({ message: "Vote recorded successfully" });

  } catch (err) {
    console.error("Vote Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
