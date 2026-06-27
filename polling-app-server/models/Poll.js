const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [
    {
      text: String,
      votes: {
        type: Number,
        default: 0
      }
    }
  ],
  isPublic: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ["active", "closed"],
    default: "active"
  },
  password: {
  type: String,
  required: true
},
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Poll", pollSchema);