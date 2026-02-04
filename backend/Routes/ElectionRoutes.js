const express = require('express');
const router = express.Router();

const Election = require('./../models/Election.js');
const Voter = require('./../models/voters.js');
const Candidate = require('./../models/candidates.js');


// ================= TEST ROUTE =================
router.get('/', (req, res) => {
  res.send("Election route working");
});


// ================= CREATE ELECTION =================
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


// ================= ADD VOTER TO ELECTION =================
router.post('/addVoters', async (req, res) => {
  try {
    const { username, electionId, ...voterData } = req.body;

    let voter = await Voter.findOne({ username });

    // If voter already exists
    if (voter) {
      const alreadyExists = voter.eligibleElections.some(
        e => e.election === electionId
      );

      if (alreadyExists) {
        return res.status(400).json({
          message: "Voter already registered in this election"
        });
      }

      voter.eligibleElections.push({ election: electionId, hasVoted: false });
      await voter.save();

      return res.status(200).json({
        message: "Election added to existing voter",
        voter
      });
    }

    // Create new voter
    const newVoter = await Voter.create({
      ...voterData,
      username,
      eligibleElections: [{ election: electionId, hasVoted: false }]
    });

    res.status(201).json({
      message: "New voter created",
      voter: newVoter
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= GET ALL VOTERS =================
router.get('/voters', async (req, res) => {
  try {
    const voters = await Voter.find();
    res.status(200).json(voters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= UPDATE VOTER =================
router.put('/updateVoter/:voterId', async (req, res) => {
  try {
    const voter = await Voter.findByIdAndUpdate(req.params.voterId, req.body, { new: true });

    if (!voter) return res.status(404).json({ message: "Voter not found" });

    res.status(200).json({ message: "Voter updated", voter });

  } catch (error) {
    res.status(500).json({ message: "Error updating voter", error: error.message });
  }
});


// ================= DELETE VOTER =================
router.delete('/deleteVoter/:voterId', async (req, res) => {
  try {
    const voter = await Voter.findByIdAndDelete(req.params.voterId);

    if (!voter) return res.status(404).json({ message: "Voter not found" });

    res.status(200).json({ message: "Voter deleted", voter });

  } catch (error) {
    res.status(500).json({ message: "Error deleting voter", error: error.message });
  }
});


// ================= ADD CANDIDATE =================
router.post('/addCandidates', async (req, res) => {
  try {
    const existing = await Candidate.findOne({ candidateId: req.body.candidateId });

    if (existing) {
      return res.status(400).json({ message: "Candidate ID already exists" });
    }

    const candidate = await Candidate.create(req.body);

    res.status(201).json({
      message: "Candidate added successfully",
      candidate
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= GET ALL CANDIDATES =================
router.get('/candidates', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= UPDATE CANDIDATE =================
router.put('/updateCandidate/:candidateId', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.candidateId,
      req.body,
      { new: true }
    );

    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    res.status(200).json({ message: "Candidate updated", candidate });

  } catch (error) {
    res.status(500).json({ message: "Error updating candidate", error: error.message });
  }
});


// ================= DELETE CANDIDATE =================
router.delete('/deleteCandidate/:candidateId', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.candidateId);

    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    res.status(200).json({ message: "Candidate deleted", candidate });

  } catch (error) {
    res.status(500).json({ message: "Error deleting candidate", error: error.message });
  }
});


// ================= GET ELECTION + CANDIDATES =================
router.get('/:electionId', async (req, res) => {
  try {
    const election = await Election.findOne({ electionId: req.params.electionId });

    if (!election) return res.status(404).json({ message: "Election not found" });

    const candidates = await Candidate.find({
      election: req.params.electionId
    });

    res.status(200).json({
      election,
      candidates
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching election",
      error: error.message
    });
  }
});


// ================= DELETE ELECTION + CLEANUP =================
router.delete('/:electionId', async (req, res) => {
  try {
    const electionId = req.params.electionId;

    const election = await Election.findOneAndDelete({ electionId });

    if (!election) return res.status(404).json({ message: "Election not found" });

    // Remove election from voters
    await Voter.updateMany(
      {},
      { $pull: { eligibleElections: { election: electionId } } }
    );

    // Delete candidates
    await Candidate.deleteMany({ election: electionId });

    res.status(200).json({
      message: "Election deleted + voters cleaned + candidates removed",
      election
    });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting election",
      error: error.message
    });
  }
});

module.exports = router;
