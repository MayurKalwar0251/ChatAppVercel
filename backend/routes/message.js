const express = require("express");
const isAuthenticated = require("../middleware/authentication");
const {
  sendMessage,
  fetchMessages,
  sendMessageAndCloudinaryForFileContent,
} = require("../controllers/message");

const messageRouter = express.Router();

// for sending message to other user
messageRouter.post(
  "/",
  isAuthenticated,
  sendMessageAndCloudinaryForFileContent
);

// for fetching messages of other and me users
messageRouter.get("/:cId", isAuthenticated, fetchMessages);

module.exports = messageRouter;
