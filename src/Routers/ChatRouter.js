const express = require("express");
const { authenticateUser } = require("../helper/Validation");
const Chat = require("../model/chat");
const ChatRouter = express.Router();


ChatRouter.get("/chat/:roomKey", authenticateUser, async (req, res) => {
  try {
    const { roomKey} = req.params;

    const chat = await Chat.findOne({
      roomKey: roomKey,
    });

    if (!chat) {
      return res.status(200).json({ message: "Chat not found" });
    }
    res.status(200).json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = ChatRouter;

