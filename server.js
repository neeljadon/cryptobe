const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const gameSocket = require("./sockets/gameSocket");
const app = require("./app");
require("dotenv").config();

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

connectDB();
gameSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
