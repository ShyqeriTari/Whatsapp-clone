import express from "express";
import createError from "http-errors";
import ChatModel from "./chat-model.js";
import MessageModel from "./message-model.js";

const chatRouter = express.Router();

chatRouter.get("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

chatRouter.post("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

chatRouter.get("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default chatRouter;
