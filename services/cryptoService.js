const axios = require("axios");

let cachedPrices = {};
let lastFetched = 0;

async function getPrice(crypto = "bitcoin") {
  const now = Date.now();
  if (now - lastFetched < 10000 && cachedPrices[crypto]) {
    return cachedPrices[crypto];
  }

  const { data } = await axios.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd`
  );
  cachedPrices[crypto] = data[crypto].usd;
  lastFetched = now;
  return data[crypto].usd;
}
