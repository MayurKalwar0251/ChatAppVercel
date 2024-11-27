const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.DB);
    console.log(`MongoDB connected with server: ${connect.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { connectDb };
