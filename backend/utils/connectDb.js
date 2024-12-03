const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(
      "mongodb+srv://mayurkalwar0251:znzl8kXYQzBZP6W8@cluster0.gszow.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log(`MongoDB connected with server: ${connect.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { connectDb };
