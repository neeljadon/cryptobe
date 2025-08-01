const mongoose = require("mongoose");
const playerSchema = new mongoose.Schema({
  username: String,
  wallet: {
    btc: { type: Number, default: 0 },
    eth: { type: Number, default: 0 },
  },
});
module.exports = mongoose.model("Player", playerSchema);