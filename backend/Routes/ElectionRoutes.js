const express = require('express');
const router = express.Router();

const Election = require('./../models/Election.js');
const Voter = require('./../models/voters.js');
const Candidate = require('./../models/candidates.js');
const bcrypt = require('bcrypt');

const { jwtAuthMiddleware, generateToken } = require('./../jwt.js');

router.post('/', async (req, res) => {
  try {

    const existing = await Election.findOne({ electionId: req.body.electionId });

    if (existing) {
      return res.status(400).json({ message: "Election ID already exists" });
    }

    const election = await Election.create({
      ...req.body   // password will be hashed automatically in pre-save
    });

    const token = generateToken({
      electionId: election.electionId,
      role: "admin"
    });

    res.status(201).json({
      message: "Election created",
      election,
      token
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//DONE
router.post('/addVoters', jwtAuthMiddleware('admin'), async (req, res) => {
  try {

    const { username } = req.body;
    const electionId = req.user.electionId;   // ✅ from token

    let voter = await Voter.findOne({ username });

    if (!voter) {
      return res.status(404).json({ message: "Voter not found" });
    }

    const alreadyExists = voter.eligibleElections.some(
      e => e.election === electionId
    );

    if (alreadyExists) {
      return res.status(400).json({ message: "Voter already registered in this election" });
    }

    voter.eligibleElections.push({
      election: electionId,
      hasVoted: false
    });

    await voter.save();

    res.status(200).json({
      message: "Voter added to election",
      voter
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// GET VOTERS (ADMIN)
router.get('/voters/:electionId', jwtAuthMiddleware('admin'), async (req, res) => {
  try {
    const voters = await Voter.find({ "eligibleElections.election": req.params.electionId });
    res.status(200).json(voters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN LOGIN (DONE)
router.post('/adminLogin', async (req, res) => {
  try {
    const { electionId, password } = req.body;

    const election = await Election.findOne({ electionId });
    if (!election) return res.status(404).json({ message: "Election not found" });

    const isMatch = await bcrypt.compare(password, election.password);
    if (!isMatch) return res.status(403).json({ message: "Incorrect password" });

    const token = generateToken({ electionId, role: 'admin' });

    res.status(200).json({ message: "Admin login successful", token });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// DELETE VOTER FROM ELECTION (ADMIN) DONE
router.delete('/removeVoter/:username', jwtAuthMiddleware('admin'), async (req, res) => {
  try {

    const username = req.params.username;
    const electionId = req.user.electionId;

    const voter = await Voter.findOne({ username });

    if (!voter) {
      return res.status(404).json({ message: "Voter not found" });
    }

    const alreadyExists = voter.eligibleElections.some(
      e => e.election === electionId
    );

    if (!alreadyExists) {
      return res.status(400).json({
        message: "Voter is not registered in this election"
      });
    }

    const updatedVoter = await Voter.findOneAndUpdate(
      { username },
      {
        $pull: {
          eligibleElections: { election: electionId }
        }
      },
      { new: true }
    );

    res.status(200).json({
      message: "VOTER REMOVED FROM ELECTION",
      voter: updatedVoter
    });

  } catch (error) {
    res.status(500).json({
      message: "Error removing voter from election",
      error: error.message
    });
  }
});
// ADD CANDIDATE (ADMIN) (DONE)
router.post('/addCandidates', jwtAuthMiddleware('admin'), async (req, res) => {
  try {
    const { name, age, candidateId } = req.body;
    
    // 1. Check if candidate ID already exists
    const existing = await Candidate.findOne({ candidateId });
    if (existing) return res.status(400).json({ message: "Candidate ID already exists" });

    // 2. USE THE ID FROM THE TOKEN (req.user), NOT THE BODY
    const electionId = req.user.electionId;

    const candidate = await Candidate.create({
      name,
      age,
      candidateId,
      electionId // Injected safely from the token
    });

    res.status(201).json({ message: "Candidate added successfully", candidate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE CANDIDATE (ADMIN) DONE
router.delete('/deleteCandidate/:candidateId', jwtAuthMiddleware('admin'), async (req, res) => {
  try {

    const { candidateId } = req.params;
    const electionId = req.user.electionId;   // ✅ from token

    const candidate = await Candidate.findOneAndDelete({
      electionId: electionId,
      candidateId: candidateId
    });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found in this election" });
    }

    res.status(200).json({ message: "Candidate deleted successfully" });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting candidate",
      error: error.message
    });
  }
});

// VIEW RESULTS (ADMIN)(DONE)
router.get('/result', jwtAuthMiddleware('admin'), async (req, res) => {
  try {
    const electionId = req.user.electionId;   // ✅ from token

    const election = await Election.findOne({ electionId });
    if (!election) return res.status(404).json({ message: "Election not found" });

    const candidates = await Candidate.find({ electionId })
      .select('name votes -_id');

    res.json({ electionId, title: election.title, results: candidates });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE ELECTION (ADMIN)
router.delete('/deleteElection', jwtAuthMiddleware('admin'), async (req, res) => {
  try {
    const election = await Election.findOne({ electionId: req.user.electionId });
    if (!election) return res.status(404).json({ message: "Election not found" });

    const isMatch = await bcrypt.compare(req.body.password, election.password);
    if (!isMatch) return res.status(403).json({ message: "Incorrect password" });

    await Election.deleteOne({ electionId: req.user.electionId });

    await Voter.updateMany({}, {
      $pull: { eligibleElections: { election: req.user.electionId } }
    });

    await Candidate.deleteMany({ electionId: req.user.electionId });

    res.status(200).json({ message: "Election deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error deleting election", error: error.message });
  }
});
//toggled election status (ADMIN) done
router.put('/toggleElection', jwtAuthMiddleware('admin'), async (req, res) => {
  try {
    const election = await Election.findOne({ electionId: req.user.electionId });

    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }
 

    // 🔥 TOGGLE
    election.isActive = !election.isActive;

    await election.save();

    res.json({
      message: `Election is now ${election.isActive ? "ACTIVE" : "INACTIVE"}`,
      isActive: election.isActive
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/current', jwtAuthMiddleware('admin'), async (req, res) => {
  try {
    const election = await Election.findOne({ electionId: req.user.electionId });

    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    res.json({
      title: election.title,
      isActive: election.isActive
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
