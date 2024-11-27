const Chat = require("../models/chat");
const Message = require("../models/message");

const sendMessage = async (req, res) => {
  try {
    const { content, chatId, fileContent, fileType } = req.body;
    const myId = req.user._id;

    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "Chat Id is required",
      });
    }

    const sender = req.user._id;

    const chat = await Chat.findById(chatId);

    const users = chat.users.filter((c) => c.toString() !== myId.toString());

    const recv = users;

    const msg = await Message.create({
      sender,
      receiver: recv,
      content,
      chatBW: chatId,
      fileContent,
      fileType,
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: msg });

    const messageSend = await Message.findById(msg._id)
      .populate("sender", "-password")
      .populate("receiver", "-password")
      .populate("chatBW");

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      messageSend,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const fetchMessages = async (req, res) => {
  const { cId } = req.params; // chat id required

  if (!cId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required",
    });
  }

  try {
    const messages = await Message.find({
      chatBW: cId,
    })
      .populate("sender", "-password") // Populate sender, excluding the password field
      .populate("receiver", "-password") // Populate receiver, excluding the password field
      .populate({
        path: "chatBW",
        populate: { path: "users", select: "-password" }, // Populate users inside chatBW
      })
      .sort({ createdAt: 1 }); // Fetch messages in ascending order (oldest to newest)

    res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      messages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  fetchMessages,
};
