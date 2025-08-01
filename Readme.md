# 💥 Crypto Crash Backend

A backend server for a real-time multiplayer **Crypto Crash** game. Players place crypto bets, watch the multiplier rise, and cash out before the game crashes — all powered by Socket.io and provably fair crash logic.

---

## 📁 Folder Structure

```
crypto-crash-backend/
│
├── controllers/          # Game and wallet controller logic
│   ├── gameController.js
│   └── walletController.js
│
├── models/               # Mongoose schemas
│   ├── GameRound.js
│   ├── Player.js
│   └── Transaction.js
│
├── routes/               # API routes
│   ├── gameRoutes.js
│   └── walletRoutes.js
│
├── services/             # Business logic
│   ├── cryptoService.js    # CoinGecko integration and caching
│   └── provablyFair.js     # Crash point generation logic
│
├── sockets/              # WebSocket game loop
│   └── gameSocket.js
│
├── utils/                # Helpers
│   └── mockTxHash.js       # Fake transaction hash generator
│
├── config/
│   └── db.js               # MongoDB connection setup
│
├── public/
│   └── client.html         # WebSocket test client
│
├── .env                    # Environment configuration
├── app.js                  # Express setup
├── server.js               # Entry point (HTTP + WS)
├── package.json
└── README.md
```

---

## ⚙️ Features

- 🔒 Provably fair crash point generation
- 🌐 CoinGecko API integration
- 📈 Real-time game using Socket.io
- 💸 Wallet simulation (deposit/withdraw/mock tx)
- 📊 MongoDB storage for game rounds, players, and transactions
- 🧪 Built-in WebSocket testing client

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/crypto.git
cd crypto
npm i
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/crypto-crash
COINGECKO_API_URL=https://api.coingecko.com/api/v3
```

### 4. Run the server

```bash
npm start
# Or for development:
npm run dev
```

Server starts on `http://localhost:5000`

---

## 🔌 WebSocket Test Client

Visit:
```
http://localhost:5000/client.html
```

Use this page to test WebSocket connection, place bets, and simulate crashes.

---

## 🔐 Provably Fair System

The crash multiplier is generated via secure hashing logic found in:

```
services/provablyFair.js
```

This ensures transparency and fairness for all players.

---

## 📦 API Endpoints

### 🎮 Game Routes - `/api/game`
- `POST /place-bet` → place a new bet
- `POST /cashout` → cash out before crash

### 💰 Wallet Routes - `/api/wallet`
- `GET /balance` → current balance
- `POST /deposit` → deposit fake currency
- `POST /withdraw` → withdraw fake currency

---

## 📚 Technologies Used

- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.io
- CoinGecko API
- dotenv
- cors

---

## 📄 License

MIT License

---

## 👨‍💻 Author

Made by **Neel Shankar** — Software developer 💻🚀
