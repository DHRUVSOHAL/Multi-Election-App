const express = require('express');
const router = express.Router();

const Election = require('./../models/Election.js');
const Voter = require('./../models/voters.js');
const Candidate = require('./../models/candidates.js');
const bcrypt = require('bcrypt');

const { jwtAuthMiddleware, generateToken } = require('./../jwt.js');

// TEST ROUTE
router.get('/', (req, res) => {
  res.send("Election route working");
});

// CREATE ELECTION (ADMIN)
router.post('/', async (req, res) => {
  try {
    const existing = await Election.findOne({ electionId: req.body.electionId });
    if (existing) {
      return res.status(400).json({ message: "Election ID already exists" });
    }

    const election = await Election.create(req.body);
    res.status(201).json({ message: "Election created", election });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD VOTER TO ELECTION (ADMIN)
router.post('/addVoters', jwtAuthMiddleware('admin'), async (req, res) => {
  try {
    const { username, electionId, ...voterData } = req.body;

    let voter = await Voter.findOne({ username });

    if (voter) {
      const alreadyExists = voter.eligibleElections.some(
        e => e.election === electionId
      );

      if (alreadyExists) {
        return res.status(400).json({ message: "Voter already registered in this election" });
      }

      voter.eligibleElections.push({ election: electionId, hasVoted: false });
      await voter.save();

      return res.status(200).json({ message: "Election added to existing voter", voter });
    }

    const newVoter = await Voter.create({
      ...voterData,
      username,
      eligibleElections: [{ election: electionId, hasVoted: false }]
    });

    res.status(201).json({ message: "New voter created", voter: newVoter });

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

// ADMIN LOGIN
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

// UPDATE VOTER (ADMIN)
router.put('/updateVoter/:voterId', jwtAuthMiddleware('admin'), async (req, res) => {
  try {
    const voter = await Voter.findByIdAndUpdate(req.params.voterId, req.body, { new: true });

    if (!voter) return res.status(404).json({ message: "Voter not found" });

    res.status(200).json({ message: "Voter updated", voter });

  } catch (error) {
    res.status(500).json({ message: "Error updating voter", error: error.message });
  }
});

// DELETE VOTER (ADMIN)
router.delete('/deleteVoter/:voterId', jwtAuthMiddleware('admin'), async (req, res) => {
  try {
    const voter = await Voter.findByIdAndDelete(req.params.voterId);

    if (!voter) return res.status(404).json({ message: "Voter not found" });

    res.status(200).json({ message: "Voter deleted", voter });

  } catch (error) {
    res.status(500).json({ message: "Error deleting voter", error: error.message });
  }
});

// ADD CANDIDATE (ADMIN)
router.post('/addCandidates', jwtAuthMiddleware('admin'), async (req, res) => {
  try {
    const existing = await Candidate.findOne({ candidateId: req.body.candidateId });
    if (existing) return res.status(400).json({ message: "Candidate ID already exists" });

    const candidate = await Candidate.create(req.body);
    res.status(201).json({ message: "Candidate added", candidate });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET CANDIDATES (ADMIN)
router.get('/candidates/:electionId', jwtAuthMiddleware('admin'), async (req, res) => {
  try {
    const candidates = await Candidate.find({ electionId: req.params.electionId });
    res.status(200).json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE CANDIDATE (ADMIN)
router.put('/updateCandidate/:id', jwtAuthMiddleware('admin'), async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    res.status(200).json({ message: "Candidate updated", candidate });

  } catch (error) {
    res.status(500).json({ message: "Error updating candidate", error: error.message });
  }
});

// DELETE CANDIDATE (ADMIN)
router.delete('/deleteCandidate/:id', jwtAuthMiddleware('admin'), async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);

    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    res.status(200).json({ message: "Candidate deleted", candidate });

  } catch (error) {
    res.status(500).json({ message: "Error deleting candidate", error: error.message });
  }
});

// VIEW RESULTS (ADMIN)
router.get('/results/:electionId', jwtAuthMiddleware('admin'), async (req, res) => {
  try {
    const electionId = req.params.electionId.trim();

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
router.delete('/:password/:electionId', jwtAuthMiddleware('admin'), async (req, res) => {
  try {
    const election = await Election.findOne({ electionId: req.params.electionId });
    if (!election) return res.status(404).json({ message: "Election not found" });

    const isMatch = await bcrypt.compare(req.params.password, election.password);
    if (!isMatch) return res.status(403).json({ message: "Incorrect password" });

    await Election.deleteOne({ electionId: req.params.electionId });

    await Voter.updateMany({}, {
      $pull: { eligibleElections: { election: req.params.electionId } }
    });

    await Candidate.deleteMany({ electionId: req.params.electionId });

    res.status(200).json({ message: "Election deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error deleting election", error: error.message });
  }
});

module.exports = router;
