const express = require('express');
const router = express.Router();

const Election = require('./../models/Election.js');
const Voter = require('./../models/voters.js');
const Candidate = require('./../models/candidates.js');

// TEST ROUTE   
router.get('/', (req, res) => {
  res.send("Voters route working");
}); 

router.get('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required"
      });
    
    }
    return res.status(200).json({ message: "Login successful for voter" });
}
catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/giveVote', async (req, res) => {
  try {
    const { username, electionId, candidateId } = req.body;

    // Validate input
    if (!username || !electionId || !candidateId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find voter
    const voter = await Voter.findOne({ username });
    if (!voter) {
      return res.status(404).json({ message: "Voter not found" });
    }

    // Check election exists
    const election = await Election.findOne({ electionId });
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    // Check election active status (optional but recommended)
    if (!election.isActive) {
      return res.status(403).json({ message: "Election is not active" });
    }

    // Check voter eligibility
    const electionEntry = voter.eligibleElections.find(
      e => e.election === electionId
    );

    if (!electionEntry) {
      return res.status(403).json({ message: "Voter not eligible for this election" });
    }

    // Prevent double voting
    if (electionEntry.hasVoted) {
      return res.status(403).json({ message: "Voter has already voted in this election" });
    }

    // Check candidate exists in this election
    const candidate = await Candidate.findOne({ candidateId, electionId });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found in this election" });
    }

    // Atomic vote increment (prevents race condition)
    await Candidate.updateOne(
      { candidateId, electionId },
      { $inc: { votes: 1 } }
    );

    // Mark voter as voted
    electionEntry.hasVoted = true;
    electionEntry.votedAt = new Date();

    await voter.save();

    return res.status(200).json({ message: "Vote recorded successfully" });

  } catch (err) {
    console.error("Vote Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
