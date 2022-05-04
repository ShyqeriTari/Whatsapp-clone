import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import app from "./app.js";
import { Server } from "socket.io";
import { createServer } from "http";
import Chat from "./services/chats/chat-model.js";

let onlineUsers = [];
// Server connection

const port = process.env.PORT;
const httpServer = createServer(app);
const io = new Server(httpServer, {});

io.on("connection", (socket) => {
  console.log("🔛 SOCKET ID: ", socket.id);
  //console.log("🤝 HANDSHAKE: ", socket.handshake);

  socket.emit("welcome");

  socket.on("setUser", ({ user, chat }) => {
    console.log(user);
    console.log(chat);

    socket.join(chat);
    onlineUsers.push({ user, socketId: socket.id, chat });

    // How to emit an event to every other client socket
    socket.broadcast.emit("userJoined");

    // socket.emit("didLogin")
  });

  socket.on("outgoingMessage", async ({ message, chatId }) => {
    console.log(message, chatId);

    // here we will save the message to our database...
    await Chat.findOneAndUpdate(
      { _id: chatId },
      { $push: { messages: message } }
    );

    socket.to(chatId).emit("incomingMessage", { message });
  });
});

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("👌 Successfully connected to Mongo!");

  httpServer.listen(port, () => {
    console.table(listEndpoints(app));
    console.log(`App is running on port ${port} 🟢`);
  });
});
