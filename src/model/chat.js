const { text } = require("express");
const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const chatSchema = new mongoose.Schema({
  roomKey: {
    type: String,
    required: true,
  },
  allMessages: [messageSchema],
});

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
