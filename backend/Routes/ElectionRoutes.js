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
    const response=await election.save();
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
router.get('/voters/:electionId', async (req, res) => {
  try {
    const voters = await Voter.find({ "eligibleElections.election": req.params.electionId });
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
router.get('/candidates/:electionId', async (req, res) => {
  try {
    const candidates = await Candidate.find({ electionId: req.params.electionId });
    res.status(200).json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= UPDATE CANDIDATE =================
router.put('/updateCandidate/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
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
router.delete('/deleteCandidate/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);

    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    res.status(200).json({ message: "Candidate deleted", candidate });

  } catch (error) {
    res.status(500).json({ message: "Error deleting candidate", error: error.message });
  }
});


// ================= SEE RESULTS (MUST BE ABOVE /:electionId) =================
router.get('/results/:electionId', async (req, res) => {
  try {
    const electionId = req.params.electionId.trim();

    const election = await Election.findOne({ electionId: electionId });
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    const candidates = await Candidate.find({ electionId: electionId })
      .select('name votes -_id');

    return res.json({
      electionId,
      title: election.title,
      results: candidates
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ================= DELETE ELECTION + CLEANUP =================
router.delete('/:password/:electionId', async (req, res) => {
  try {
   const election = await Election.findOne({ electionId: req.params.electionId });

if (!election) {
  return res.status(404).json({ message: "Election not found" });
}

const isMatch = await bcrypt.compare(req.params.password, election.password);
if (!isMatch) {
  return res.status(403).json({ message: "Incorrect password" });
}

// Now delete
await Election.deleteOne({ electionId: req.params.electionId });

    await Voter.updateMany(
      {},
      { $pull: { eligibleElections: { election: req.params.electionId } } }
    );

    // Delete candidates for that election
    await Candidate.deleteMany({ electionId: req.params.electionId });

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
