const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Make io accessible in routes
app.set("io", io);

// Socket.io connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins a specific poll room
  socket.on("join-poll", (pollId) => {
    socket.join(pollId);
    console.log(`User joined poll: ${pollId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Connect to MongoDB then start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(5000, () => {
      console.log("Server running on http://localhost:5000");
    });
  })
  .catch((err) => console.log(err));