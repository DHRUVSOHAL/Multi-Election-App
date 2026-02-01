const express = require('express');
const router = express.Router();
 
const Election = require('./../models/Election.js');
const Voter = require('./../models/voters.js');

const Candidate = require('./../models/candidates.js');


// CREATE ELECTION

router.get('/', (req,res)=>{
    res.send("Election route working");
})


router.post('/', async (req, res) => {//creating election
  try {
    const election = await Election.create(req.body);
    res.status(201).json({ message: "Election created", election });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/voters', async (req, res) => {
  try {
    const { username, eligibleElections, ...voterData } = req.body;

    // Check if voter already exists
    let existingVoter = await Voter.findOne({ username });

    if (existingVoter) {
      // Add new election if not already present
      const newElection = eligibleElections[0];

      const alreadyAdded = existingVoter.eligibleElections.some(
        e => e.election.toString() === newElection.election
      );

      if (alreadyAdded) {
        return res.status(400).json({
          message: "Voter already registered for this election"
        });
      }

      existingVoter.eligibleElections.push(newElection);
      await existingVoter.save();

      return res.status(200).json({
        message: "Election added to existing voter",
        voter: existingVoter
      });
    }

    // If voter does not exist → create new
    const newVoter = await Voter.create(req.body);

    res.status(201).json({
      message: "New voter created",
      voter: newVoter
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/candidates', async (req, res) => {
  try {
    const candidate = await Candidate.create(req.body);
    res.status(201).json({ message: "Candidate created", candidate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/allElections/:electionId', async (req,res)=>{
    try{
        const elections = await Election.find({electionId:req.params.electionId});
        res.status(200).json(elections);
    }
    catch(error){
        res.status(500).json({
            message: "Error fetching elections",
            error: error.message
        });
    }   
});

router.delete('/deleteElection/:electionId', async (req,res)=>{
    try{
        const election = await Election.findOneAndDelete({electionId:req.params.electionId});   
        if(!election){
            return res.status(404).json({
                message: "Election not found"
            });
        }
        res.status(200).json({
            message: "Election deleted successfully",
            election
        });

    }
    catch(error){
        res.status(500).json({
            message: "Error deleting election", 
            error: error.message
        });
    }
});
router.put('/updateVoter/:voterId', async (req,res)=>{
    try{
        const voter = await Voter.findByIdAndUpdate(req.params.voterId, req.body, {new:true});
        if(!voter){
            return res.status(404).json({
                message: "Voter not found"
            });
        }
        res.status(200).json({
            message: "Voter updated successfully",
            voter
        });
    }
    catch(error){
        res.status(500).json({
            message: "Error updating voter",
            error: error.message
        });
    }
})

router.put('/updateCandidate/:candidateId', async (req,res)=>{
    try{
        const candidate = await Candidate.findByIdAndUpdate(req.params.candidateId, req.body, {new:true});
        if(!candidate){
            return res.status(404).json({   
                message: "Candidate not found"
            });
        }
        res.status(200).json({
            message: "Candidate updated successfully",
            candidate
        });
    }
    catch(error){
        res.status(500).json({
            message: "Error updating candidate",
            error: error.message
        });
    }
});
module.exports = router;
