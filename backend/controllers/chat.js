const Chat = require("../models/chat");
const User = require("../models/user");
const Message = require("../models/message");

const createOneToOneChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(500).json({
      success: false,
      message: "Pass All Required Details",
    });
  }

  const myId = req.user._id;

  const existsChat = await Chat.find({
    isGroupChat: false,
    users: { $all: [myId, userId] },
  });

  if (existsChat.length > 0) {
    return res.status(200).json({
      success: false,
      message: "Chat Already Exists",
    });
  }

  const chatData = {
    chatName: "One To One",
    users: [userId, myId],
  };

  const chatCreation = await Chat.create(chatData);

  const chat = await Chat.findById(chatCreation._id).populate("users");

  res.status(200).json({
    success: true,
    message: "Chat Created Successfully",
    chat,
  });
};

const fetchChats = async (req, res) => {
  try {
    const myId = req.user._id;

    const chats = await Chat.find({
      users: { $in: [myId] },
    })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    return res
      .status(200)
      .json({ success: true, message: "Chats fetched successfully", chats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch chats" });
  }
};

// const fetchChatsById = async (req, res) => {
//   try {
//     const { cId } = req.params;

//     const myId = req.user._id;

//     const chat = await Chat.findById(cId)
//       .populate("users", "-password")
//       .populate("latestMessage");

//     if (!chat) {
//       return res
//         .status(500)
//         .json({ success: false, message: "Failed to fetch chats." });
//     }

//     return res
//       .status(200)
//       .json({ success: true, message: "Chats fetched successfully", chat });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Failed to fetch chats" });
//   }
// };

const fetchChatsById = async (req, res) => {
  try {
    const { cId } = req.params;
    const myId = req.user._id;

    // Fetch the chat with populated data
    const chat = await Chat.findById(cId)
      .populate("users", "-password")
      .populate("latestMessage");

    if (!chat) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch chats." });
    }

    // Calculate total unseen messages for the logged-in user
    const totalUnseenCount = await Message.countDocuments({
      chatBW: cId, // Match messages in the current chat
      sender: { $ne: myId }, // Sender should not be the logged-in user
      receiver: myId, // The logged-in user must be in the receiver array
      isRead: false, // Message must be unseen
    });

    return res.status(200).json({
      success: true,
      message: "Chats fetched successfully",
      chat: {
        ...chat._doc,
        totalUnseenCount, // Add total unseen count to the response
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch chats" });
  }
};

const createGroupChat = async (req, res) => {
  const { users, chatName } = req.body;

  if (!users || !chatName) {
    return res.status(500).json({
      success: false,
      message: "Pass All Required Details",
    });
  }

  const myId = req.user._id;

  if (users.length < 2) {
    return res
      .status(500)
      .json({ success: false, message: "Atleast Add 2 Users" });
  }

  try {
    const allUsers = [...users, myId];

    const data = {
      chatName,
      users: allUsers,
      isGroupChat: true,
      groupAdmin: myId,
    };

    const groupChat = await Chat.create(data);

    const chat = await Chat.findById(groupChat._id)
      .populate("users")
      .populate("groupAdmin");

    res.status(200).json({
      success: true,
      message: "Group Chat Created Successfully",
      chat,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ success: false, message: error.message });
  }
};

// search user for creating a chat
const searchUser = async (req, res) => {
  const { searchVal } = req.body;
  const myId = req.user._id;

  if (!searchVal || searchVal.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Search value cannot be empty",
    });
  }

  try {
    // Use regex to match fields that start with the search value
    const regex = new RegExp(`^${searchVal}`, "i"); // Match values starting with `searchVal`, case-insensitive

    const searchUsers = await User.find({
      _id: { $ne: myId }, // Exclude the logged-in user
      $or: [
        { name: { $regex: regex } }, // Check if `name` starts with searchVal
        { phoneNo: { $regex: regex } }, // Check if `phoneNo` starts with searchVal
      ],
    }).limit(5);

    if (searchUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found matching the search criteria",
      });
    }

    res.status(200).json({
      success: true,
      message: "Searched users...",
      chat: searchUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching for users",
      error: error.message,
    });
  }
};

const checkOrCreateChat = async (req, res) => {
  const { userId } = req.body;

  const myId = req.user._id;

  let check = await Chat.findOne({
    users: {
      $all: [userId, myId],
    },
  });

  if (!check) {
    check = await Chat.create({
      chatName: "One To One",
      users: [userId, myId],
    });
  }

  const chat = await Chat.findById(check._id)
    .populate("latestMessage")
    .populate("users");

  res.status(200).json({
    success: true,
    message: "Checked",
    chat: chat,
  });
};

module.exports = {
  createOneToOneChat,
  fetchChats,
  fetchChatsById,
  createGroupChat,
  searchUser,
  checkOrCreateChat,
};
