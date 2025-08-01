const { generateCrashPoint } = require("../services/provablyFair");
const GameRound = require("../models/GameRound");

let roundId = 1;
let currentRound = null;
let multiplier = 1.0;
let crashPoint = 2.0;
let timer = null;

function startRound(io) {
  console.log(`Starting round ${roundId}`);
  crashPoint = generateCrashPoint("someSeed", roundId);
  multiplier = 1.0;

  currentRound = {
    roundId,
    startTime: new Date(),
    bets: [],
    cashouts: [],
    crashPoint,
  };

  io.emit("round:start", {
    roundId,
    startTime: currentRound.startTime,
  });

  timer = setInterval(() => updateMultiplier(io), 100);
}

function updateMultiplier(io) {
  multiplier = parseFloat((multiplier + 0.05 * multiplier).toFixed(2));
  io.emit("round:multiplier", { multiplier });

  if (multiplier >= crashPoint) {
    endRound(io);
  }
}

async function endRound(io) {
  clearInterval(timer);
  const roundData = new GameRound({
    ...currentRound,
    endTime: new Date(),
    crashPoint,
  });
  await roundData.save();
  io.emit("round:crash", { crashPoint });

  roundId++;
  setTimeout(() => startRound(io), 10000);
}

function handleCashout(io, socket) {
  socket.on("player:cashout", async ({ playerId, currency }) => {
    if (multiplier >= crashPoint) {
      socket.emit("cashout:error", { message: "Cashout failed: Game has crashed." });
      return;
    }

    const existingCashout = currentRound.cashouts.find((c) => c.playerId === playerId);
    if (existingCashout) {
      socket.emit("cashout:error", { message: "Cashout already made." });
      return;
    }

    const bet = currentRound.bets.find((b) => b.playerId === playerId);
    if (!bet) {
      socket.emit("cashout:error", { message: "No bet found for this player." });
      return;
    }

    const payout = parseFloat((bet.cryptoAmount * multiplier).toFixed(8));
    currentRound.cashouts.push({ playerId, payout, multiplier });

    io.emit("player:cashout", {
      playerId,
      payout,
      usdValue: payout * bet.price,
      multiplier,
    });
  });
}

module.exports = function gameSocket(io) {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("player:bet", (data) => {
      if (currentRound) {
        currentRound.bets.push(data);
        console.log(`Bet placed by ${data.playerId}:`, data);
      }
    });

    handleCashout(io, socket);
  });

  startRound(io);
};
