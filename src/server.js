import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import app from "./app.js";
import { Server } from "socket.io";
import { createServer } from "http";
import Chat from "./services/chats/chat-model.js";
import { verifyAccessToken } from "./auth/tools.js";
import chatModel from "./services/chats/chat-model.js";

let onlineUsers = [];
// Server connection

const port = process.env.PORT;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  origin: "https://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true,
});

io.on("connection", async (socket) => {
  console.log("🔛 SOCKET ID: ", socket.id);
  // console.log(
  //   "🤝 HANDSHAKE TOKEN: ",
  //   socket.handshake.headers.cookie.split("=")[1]
  // );
  const token = socket.handshake.headers.cookie.split("=")[1];
  const payload = await verifyAccessToken(token);
  // console.log("TOKEN PAYLOAD: ", payload);
  socket.emit("welcome");

  // now you have user id....
  console.log(`🟢 ${payload.username} IS ONLINE`);
  onlineUsers.push(payload._id);
  console.log(" 📻 ONLINE USERS: ", onlineUsers);
  // grabbing chats for this user....
  const userChats = await chatModel.find({
    members: { $all: [payload._id] },
  });
  // console.log(
  //   ` 👩‍👩‍👧‍👧THESE ARE CHATS THIS USER ${payload.username} IS MEMBER OF: `,
  //   userChats
  // );
  // the chats to join are chatDocs.map(c => c._id.toString())
  const chats = userChats.map((chat) => chat._id.toString());
  //console.log("THIS IS ARRAY WITH CHAT IDs TO JOIN: ", chats);
  socket.join(chats);

  socket.on("outgoingMessage", async ({ message, chatId }) => {
    /**
     * message: {
     * sender: "userid"
     * content: {
     * text: string
     * media?: string
     * }
     * timestamp: number
     * }
     */

    /*   const message = {
      ...message,
      sender: payload._id,
    }; */
    console.log(message, chatId);
    console.log(payload._id);

    // here we will save the message to our database...
    await Chat.findOneAndUpdate(
      { _id: chatId },
      { $push: { messages: message } }
    );

    socket.to(chatId).emit("incomingMessage", { message });
  });

  socket.on("disconnect", () => {
    console.log(`❌ ${payload.username}, _ID: ${payload._id} disconnected`);
    onlineUsers = onlineUsers.filter((user) => user !== payload._id);
    console.log(" 📻 ONLINE USERS: ", onlineUsers);
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
