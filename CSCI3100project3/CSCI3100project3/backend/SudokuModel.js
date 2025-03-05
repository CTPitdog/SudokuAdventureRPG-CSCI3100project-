const mongoose = require('mongoose');

const sudokuSchema = new mongoose.Schema({
  puzzle: [[Number]],
  solution: [[Number]],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Sudoku', sudokuSchema);