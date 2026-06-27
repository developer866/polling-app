const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const initSocket = require("./config/socket");
const setupSwagger = require("./config/swagger");
const pollRoutes = require("./routes/poll");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Initialize socket
const io = initSocket(server);
app.set("io", io);

// Routes
app.use("/api", pollRoutes);

// Swagger
setupSwagger(app);

// Test
app.get("/", (req, res) => {
  res.send("Polling app server is running");
});

// Connect DB then start server
connectDB().then(() => {
  server.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
  });
});