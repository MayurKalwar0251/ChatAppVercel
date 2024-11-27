const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLen: [6, "Minimum Length Should be 6"],
      select: false,
    },
    avatar: {
      type: String,
    },
    lastSeen: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true, strictPopulate: false }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
