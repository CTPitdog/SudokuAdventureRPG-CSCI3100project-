const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const Sudoku = require('./sudokuModel');

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/CSCI3100project";

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000", // Frontend origin
  methods: ["GET", "POST"],       // Allowed HTTP methods
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("Successfully connected to MongoDB."))
  .catch((error) => {
    console.log("Could not connect to MongoDB.");
    console.error(error);
  });

app.get("/api/test-db", async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };
    res.json({ 
      status: "success",
      message: `Database is ${states[dbState]}`,
      state: dbState 
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error",
      message: "Error checking database connection",
      error: error.message 
    });
  }
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get("/api/sudoku/:difficulty", async (req, res) => {
  try {
    const difficulty = req.params.difficulty;
    console.log(`Querying difficulty: ${difficulty}`);
    const count = await Sudoku.countDocuments({ difficulty });
    console.log(`Total puzzles found: ${count}`);
    if (count === 0) {
      return res.status(404).json({ 
        status: "error",
        message: `No puzzles found for difficulty: ${difficulty}`
      });
    }
    
    const [puzzle] = await Sudoku.aggregate([
      { $match: { difficulty } },
      { $sample: { size: 1 } }
    ]);
    console.log(`Selected puzzle ID: ${puzzle._id}`);

    if (!puzzle) {
      return res.status(404).json({ 
        status: "error",
        message: `No puzzle found for difficulty: ${difficulty}`
      });
    }
    
    res.json({
      status: "success",
      data: {
        puzzle: puzzle.puzzle,
        solution: puzzle.solution,
        difficulty: puzzle.difficulty
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error",
      message: "Server error",
      error: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});