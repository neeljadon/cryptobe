const GameRound = require("../models/GameRound");
const Player = require("../models/Player");
const Transaction = require("../models/Transaction");
const { getCryptoPrice } = require("../services/cryptoService");
const generateMockTxHash = require("../utils/mockTxHash");

exports.placeBet = async (req, res) => {
  const { playerId, usdAmount, currency } = req.body;

  // Validate input
  if (!playerId || !usdAmount || !currency) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const player = await Player.findById(playerId);
  if (!player) {
    return res.status(404).json({ error: "Player not found" });
  }

  const price = await getCryptoPrice(currency);
  const cryptoAmount = usdAmount / price;

  if (player.wallet[currency] < cryptoAmount) {
    return res.status(400).json({ error: "Insufficient balance" });
  }

  // Update player's wallet
  player.wallet[currency] -= cryptoAmount;
  await player.save();

  // Create transaction
  const tx = await Transaction.create({
    playerId,
    usdAmount,
    cryptoAmount,
    currency,
    transactionType: "bet",
    transactionHash: generateMockTxHash(),
    priceAtTime: price,
  });

  res.json({ message: "Bet placed", tx });
};

exports.cashout = async (req, res) => {
  const { playerId, roundId, multiplier, currency } = req.body;

  // Validate input
  if (!playerId || !roundId || !multiplier || !currency) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const round = await GameRound.findOne({ roundId });
  if (!round) {
    return res.status(404).json({ error: "Round not found" });
  }

  const bet = round.bets.find((b) => b.playerId == playerId);
  if (!bet) {
    return res.status(404).json({ error: "Bet not found" });
  }

  const payoutCrypto = bet.cryptoAmount * multiplier;
  const player = await Player.findById(playerId);
  if (!player) {
    return res.status(404).json({ error: "Player not found" });
  }

  // Update player's wallet
  player.wallet[currency] += payoutCrypto;
  await player.save();

  // Create transaction
  const tx = await Transaction.create({
    playerId,
    usdAmount: payoutCrypto * bet.price,
    cryptoAmount: payoutCrypto,
    currency,
    transactionType: "cashout",
    transactionHash: generateMockTxHash(),
    priceAtTime: bet.price,
  });

  // Update round cashouts
  round.cashouts.push({ playerId, payoutCrypto, multiplier });
  await round.save();

  res.json({ message: "Cashed out", tx });
};
