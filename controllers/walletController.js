const Player = require("../models/Player");
const { getCryptoPrice } = require("../services/cryptoService");

exports.getWallet = async (req, res) => {
  const { playerId } = req.params;
  const player = await Player.findById(playerId);
  if (!player) return res.status(404).json({ error: "Player not found" });

  const btcPrice = await getCryptoPrice("bitcoin");
  const ethPrice = await getCryptoPrice("ethereum");

  res.json({
    wallet: player.wallet,
    usdValue: {
      btc: player.wallet.btc * btcPrice,
      eth: player.wallet.eth * ethPrice,
    },
  });
};