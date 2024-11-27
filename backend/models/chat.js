const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true, strictPopulate: false }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
