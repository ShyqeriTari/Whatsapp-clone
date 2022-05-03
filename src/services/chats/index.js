import express from "express";
import createError from "http-errors";
import ChatModel from "./chat-model.js";
import MessageModel from "./message-model.js";
import UserModel from "../users/model.js";
import mongoose from "mongoose";

const chatRouter = express.Router();

// ACTIVE ENDPOINT - 1 -  Returns all chats in which you are a member.
// Chat history doesn't get provided with this endpoint or the body payload would quickly become excessive.
//RESPONSES: 404 -Chat Not Found, 200 - Success, 401 - Unauthorized
chatRouter.get("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

// ACTIVE ENDPOINT - 2 - This endpoint should check if the request sender already had an active chat
// with this recipient and return it if present.
//Otherwise, it creates a new chat among the request sender and the recipient the request body.
// When this happens, on the socket layer, this endpoint should
//also make sure that the sockets of both users
// are joining this newly created room
//(otherwise none of them would be listening to incoming messages to this room).
//RESPONSES: 200 Returning a previously existing chat  ;  201 Created a new chat

chatRouter.post("/", async (req, res, next) => {
  try {
    // 1 check if the request sender already has a chat with the recipient

    if (chatExists) {
      // 2 - Return messages in the chat
    }
    // 3 - if chat doesn't exist, create a new chat
  } catch (error) {
    next(error);
  }
});

// TESTING ENDPOINT for creating chats
// --> My ID I retrieve from JWT Token
chatRouter.post("/create-chat", async (req, res, next) => {
  try {
    const newChat = new ChatModel(req.body);
    const { _id } = await newChat.save();
    console.log(req.body);
    const recipient = mongoose.Types.ObjectId(req.body.recipient);
    const chat = await ChatModel.findByIdAndUpdate(
      { _id: mongoose.Types.ObjectId(_id) },
      { $addToSet: { members: recipient } },
      { new: true }
    );
    console.log(chat);
    res.status(201).send(chat);
  } catch (error) {
    next(error);
  }
});

//TESTING ENDPOINT for getting all chats
chatRouter.get("/get-chats", async (req, res, next) => {
  try {
    const chats = await ChatModel.find({})
      .populate({ path: "members" })
      .populate({ path: "messages" });

    res.send(chats);
  } catch (error) {
    next(error);
  }
});

// ACTIVE ENDPOINT - 3 - Returns full message history for a specific chat

chatRouter.get("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

//TESTING ENDPOINT for sending messages

chatRouter.post("/:id/message", async (req, res, next) => {
  try {
    //1 - find chat with ID
    console.log(req.params.id);
    let chatToUpdate = await ChatModel.findById(req.params.id);

    //2 - if chat exists - push a message to the messages

    if (chatToUpdate) {
      console.log("This is chat to update from params:  ", chatToUpdate);
      console.log("This is request body: ", req.body);

      const newMessage = new MessageModel(req.body);
      const { _id } = await newMessage.save();

      chatToUpdate = await ChatModel.findByIdAndUpdate(
        { _id: mongoose.Types.ObjectId(req.params.id) },
        { $push: { messages: _id } },
        { new: true }
      );

      res.status(201).send(chatToUpdate);
    } else {
      res.status(404);
    }
  } catch (error) {
    next(error);
  }
});

export default chatRouter;
