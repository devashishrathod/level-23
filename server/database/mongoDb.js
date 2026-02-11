const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

console.log("url ", process.env.MONGO_URL);

exports.mongoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Level-23 MongoDb connection established");
  } catch (error) {
    console.log("❌ Error connecting to mongoDB:", error.message);
  }
};
