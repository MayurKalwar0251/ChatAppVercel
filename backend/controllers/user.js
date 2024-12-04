const User = require("../models/user");
const Chat = require("../models/chat");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
    const { name, email, phoneNo, password } = req.body;
    const avatar =
      req.body.avatar ??
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

    if (!name || !email || !password || !phoneNo) {
      return res.status(500).json({
        success: false,
        message: "All Fields Are Required",
      });
    }

    let user = await User.findOne({ email });

    if (user) {
      return res.status(500).json({
        success: false,
        message: "User Already Exists",
      });
    }

    const hashPass = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      email,
      password: hashPass,
      phoneNo,
      avatar,
    });

    sendToken(user, 200, "User Created Successfully", res);
  } catch (error) {
    console.log(error.message, " Error Message ", error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(500).json({
      success: false,
      message: "All Fields Are Required",
    });
  }

  let user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(500).json({
      success: false,
      message: "User Doesn't Exist",
    });
  }

  const comparePass = await bcrypt.compare(password, user.password);

  if (!comparePass) {
    return res.status(500).json({
      success: false,
      message: "Password Doesn't Match",
    });
  }

  // sendToken(user, 200, "User Logged In Successfully", res);

  req.session.userId = user._id;
  res.status(200).json({
    success: true,
    message: "User Login Success",
    session: req.session.userId,
    user,
  });
};

const generateToken = async (userID) => {
  const token = await jwt.sign({ id: userID }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return token;
};

const sendToken = async (user, statusCode, message, res) => {
  const token = await generateToken(user._id);

  const options = {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    httpOnly: process.env.NODE_ENV == "production" ? true : false,
    sameSite: "none",
    secure: true,
    path: "/",
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message,
    user,
    token,
  });
};

const getUserDetails = async (req, res) => {
  const myId = req.user._id;

  const user = await User.findById(myId);

  res.status(200).json({
    success: true,
    user,
  });
};

const searchUserChats = async (req, res) => {
  try {
    const { searchVal } = req.query; // Get search value from query params
    const myId = req.user._id; // Logged-in user's ID

    if (!searchVal) {
      return res
        .status(400)
        .json({ success: false, message: "Search value is required." });
    }

    // Find users by name using regex, excluding the logged-in user
    const users = await User.find({
      name: { $regex: searchVal, $options: "i" }, // Case-insensitive regex search
      _id: { $ne: myId }, // Exclude self
    }).select("-password"); // Exclude sensitive fields like password

    // Find all chats involving the logged-in user
    const chats = await Chat.find({ users: myId });

    // Extract IDs of users the logged-in user has already chatted with
    const existingChatUserIds = chats.flatMap((chat) =>
      chat.users.filter((userId) => userId.toString() !== myId.toString())
    );

    // Add a flag to indicate if a chat already exists with the user
    const usersWithChatFlag = users.map((user) => ({
      ...user.toObject(),
      hasChat: existingChatUserIds.some(
        (chatUserId) => chatUserId.toString() === user._id.toString()
      ),
    }));

    res.status(200).json({ success: true, users: usersWithChatFlag });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while searching users.",
    });
  }
};

const updateUser = async (req, res) => {};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  getUserDetails,
  searchUserChats,
};
