const Poll = require("../models/Poll");

const createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;
    const poll = new Poll({
      question,
      options: options.map((option) => ({ text: option })),
    });
    await poll.save();
    res.status(201).json(poll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getSinglePoll = async (req, res) => {     
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) {
            return res.status(404).json({ message: "Poll not found" });
        }
        res.json(poll);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// submit vote 
const submitVote = async (req, res) => {
    try{
        const {optionIndex} = req.body;
        const poll = await Poll.findById(req.params.id);

        if(!poll){
            return res.status(404).json({message: "Poll not found"});
        }
        // Increment the vote count for the selected option
        poll.options[optionIndex].votes += 1;
        await poll.save();

        // Emit the updated poll to all clients in the poll room
        const io = req.app.get("io");
        io.to(req.params.id).emit("poll-updated", poll);
        res.json(poll);
    } catch (error) {
        res.status(500).json({ message: error.message });   
    }
}

// Get all polls (for testing purposes)
const test = async (req, res) => {
    try {
        const polls = await Poll.find();
        res.json(polls);    
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createPoll, test, getSinglePoll, submitVote };