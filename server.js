const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const gameSocket = require("./sockets/gameSocket");
const app = require("./app");
require("dotenv").config();

// Create HTTP server
const server = http.createServer(app);

// Attach Socket.IO with proper CORS for Netlify frontend
const io = new Server(server, {
  cors: {
    origin: "https://courageous-snickerdoodle-7eba00.netlify.app", // 👈 your Netlify frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Connect to MongoDB
connectDB();

// Initialize game socket logic
gameSocket(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
