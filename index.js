const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Initialize socket.io with the server
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Allow only your frontend origin
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Socket.io Server Running");
});

// Handle socket connections
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("customerMessage", (data) => {
    console.log("Message from customer:", data);
    io.emit("adminMessage", data); // Broadcast to all admins
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
