const mongoose = require("mongoose");
const gameRoundSchema = new mongoose.Schema({
  roundId: Number,
  crashPoint: Number,
  startTime: Date,
  endTime: Date,
  bets: Array,
  cashouts: Array,
});
module.exports = mongoose.model("GameRound", gameRoundSchema);