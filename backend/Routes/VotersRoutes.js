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


// =======================
// VOTER LOGIN
// =======================
router.post('/login', async (req, res) => {
  try {

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    const voter = await Voter.findOne({ username });

    if (!voter) {
      return res.status(404).json({ message: "Voter not found" });
    }

    const isMatch = await bcrypt.compare(password, voter.password);

    if (!isMatch) {
      return res.status(403).json({ message: "Incorrect password" });
    }

    const token = generateToken({
      username: voter.username,
      role: 'voter'
    });

    res.status(200).json({
      message: "Login successful",
      token
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// =======================
// REGISTER VOTER
// =======================
router.post('/addVoter', async (req, res) => {
  try {

    const { name, age, gender, username, password } = req.body;

    if (!name || !age || !gender || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingVoter = await Voter.findOne({ username });

    if (existingVoter) {
      return res.status(400).json({
        message: "Username already exists"
      });
    }

    const newVoter = await Voter.create({
      name,
      age,
      gender,
      username,
      password,
      eligibleElections: []
    });

    res.status(201).json({
      message: "Voter registered successfully",
      voter: newVoter
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// =======================
// GIVE VOTE
// =======================
router.put('/giveVote', jwtAuthMiddleware('voter'), async (req, res) => {
  try {

    const username = req.user.username;
    const { electionId, candidateId } = req.body;

    if (!electionId || !candidateId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const voter = await Voter.findOne({ username });

    if (!voter) {
      return res.status(404).json({ message: "Voter not found" });
    }

    const election = await Election.findOne({ electionId });

    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    if (!election.isActive) {
      return res.status(403).json({ message: "Election is not active" });
    }

    const electionEntry = voter.eligibleElections.find(
      e => String(e.election) === String(electionId)
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

    // increment vote safely
    await Candidate.findOneAndUpdate(
      { candidateId, electionId },
      { $inc: { votes: 1 } },
      { new: true }
    );

    electionEntry.hasVoted = true;
    electionEntry.votedAt = new Date();

    await voter.save();

    res.status(200).json({
      message: "Vote recorded successfully"
    });

  } catch (err) {
    console.error("Vote Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.put('/updateSelf', jwtAuthMiddleware('voter'), async (req, res) => {
  try {
    const username = req.user.username;

    const voter = await Voter.findOne({ username });

    if (!voter) {
      return res.status(404).json({ message: "Voter not found" });
    }

    const { name, age, gender, oldPassword, newPassword } = req.body;

    // 🔐 Step 1: Old password required
    if (!oldPassword) {
      return res.status(400).json({ message: "Old password is required" });
    }

    // 🔐 Step 2: Verify old password
    const isMatch = await bcrypt.compare(oldPassword, voter.password);

    if (!isMatch) {
      return res.status(403).json({ message: "Incorrect old password" });
    }

    // ==========================
    // Step 3: Update fields
    // ==========================
    if (name) voter.name = name;
    if (age) voter.age = age;
    if (gender) voter.gender = gender;

    // 🔐 Step 4: Update password (if provided)
    if (newPassword) {
      voter.password = newPassword; // will hash automatically
    }

    await voter.save();

    res.json({ message: "Profile updated successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//done
router.get('/dashboard', jwtAuthMiddleware('voter'), async (req, res) => {
  try {

    const username = req.user.username;

    const voter = await Voter.findOne({ username : username });

    if (!voter) {
      return res.status(404).json({ message: "Voter not found" });
    }

    const elections = voter.eligibleElections.map(e => ({
      election: e.election,
      hasVoted: e.hasVoted
    }));

    res.status(200).json({
      name: voter.name,
      age: voter.age,
      gender: voter.gender,
      username: voter.username,
      elections
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;