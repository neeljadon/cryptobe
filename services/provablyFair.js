const crypto = require('crypto');

function generateSeed() {
  return crypto.randomBytes(16).toString('hex');
}

function generateCrashPoint(seed, round) {
  const hash = crypto.createHash('sha256').update(seed + round).digest('hex');
  const int = parseInt(hash.slice(0, 8), 16);
  const maxCrash = 100;
  const crashMultiplier = 1 + (int % (maxCrash * 100)) / 100;
  return parseFloat(crashMultiplier.toFixed(2));
}

module.exports = {
  generateSeed,
  generateCrashPoint,
};
