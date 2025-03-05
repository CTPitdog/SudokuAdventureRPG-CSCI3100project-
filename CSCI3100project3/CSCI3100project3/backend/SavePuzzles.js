// SavePuzzles.js
const mongoose = require('mongoose');
const Sudoku = require('./sudokuModel');
const puzzles = require('./sudokuPuzzles');

const mongoURI = 'mongodb://localhost:27017/CSCI3100project'; // Replace with your MongoDB URI

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

const savePuzzlesToDB = async () => {
  try {
    // Flatten all puzzles from each difficulty into a single array
    const puzzleDocs = [
      ...puzzles.easy.map(p => ({
        puzzle: p.puzzle,
        solution: p.solution,
        difficulty: 'easy'
      })),
      ...puzzles.medium.map(p => ({
        puzzle: p.puzzle,
        solution: p.solution,
        difficulty: 'medium'
      })),
      ...puzzles.hard.map(p => ({
        puzzle: p.puzzle,
        solution: p.solution,
        difficulty: 'hard'
      }))
    ];

    await Sudoku.deleteMany({}); // Clear existing puzzles
    const result = await Sudoku.insertMany(puzzleDocs);
    console.log(`Successfully saved ${result.length} puzzles!`);
  } catch (error) {
    console.error('Error saving puzzles:', error);
  } finally {
    mongoose.connection.close();
  }
};

savePuzzlesToDB();