const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const socketIo = require("socket.io");
const cors = require("cors");

// Initialize Express app
const app = express();

app.use(cors());

//MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/Advisa")
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.get("/", (req, res) => {
  res.send("Hello! The server is working.");
});

const messageSchema = new mongoose.Schema({
  chatId: String,
  sender: String,
  message: String,
  timestamp: { type: Date, default: Date.now }, //Auto set the timestamp
});

const Message = mongoose.model("Message", messageSchema);

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server);

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for the 'joinChat' event
  socket.on("joinChat", (chatId) => {
    socket.join(chatId); // User joins a specific chat room
    console.log(`User joined chat room: ${chatId}`);
  });

  socket.on("leaveRoom", ({ chatId }) => {
    socket.leave(chatId); // Leave the room
    console.log(`${socket.id} left room ${chatId}`);
  });

  // Listen for 'sendMessage' event
  socket.on("sendMessage", async ({ chatId, sender, message }) => {
    const newMessage = new Message({ chatId, sender, message });

    // Save message to MongoDB
    try {
      await newMessage.save(); // Save the message to the database

      // Broadcast the message to the chat room
      io.to(chatId).emit("receiveMessage", newMessage);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.get("/chat-history/:chatId", async (req, res) => {
  const { chatId } = req.params;
  try {
    const chatHistory = await Message.find({ chatId })
      .sort({ timestamp: 1 }) // Sort by timestamp, oldest first
      .limit(50); // Limit to the last 50 messages
    res.json(chatHistory); // Return chat history as JSON
  } catch (error) {
    console.error("Error retrieving chat history:", error);
    res.status(500).send("Error retrieving chat history");
  }
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
