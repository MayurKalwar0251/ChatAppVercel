const express = require("express");
const {
  createOneToOneChat,
  fetchChats,
  createGroupChat,
  searchUser,
  checkOrCreateChat,
  fetchChatsById,
} = require("../controllers/chat");
const isAuthenticated = require("../middleware/authentication");

const chatRouter = express.Router();

// for creating chat with user
chatRouter.post("/", isAuthenticated, createOneToOneChat);

// for fetching chats of logged in user
chatRouter.get("/", isAuthenticated, fetchChats);

// for fetching chat of id
chatRouter.get("/:cId", isAuthenticated, fetchChatsById);

// for fetching chats of logged in user
chatRouter.post("/group", isAuthenticated, createGroupChat);

// for fetching chats of logged in user
chatRouter.post("/group", isAuthenticated, createGroupChat);

// for searching user so it can create chat with him
chatRouter.post("/search", isAuthenticated, searchUser);

chatRouter.post("/search", isAuthenticated, searchUser);

// for searching user so it can create chat with him
chatRouter.post("/check", isAuthenticated, checkOrCreateChat);

module.exports = chatRouter;
