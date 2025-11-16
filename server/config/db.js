const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Try to connect with the provided URI
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Atlas Connection Failed:", error.message);

    // Try local MongoDB as fallback
    console.log("🔄 Trying local MongoDB...");
    try {
      const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/sportconnect', {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✅ Local MongoDB Connected: ${localConn.connection.host}`);
    } catch (localError) {
      console.error("❌ Local MongoDB also failed:", localError.message);
      console.log("\n⚠️  MongoDB Connection Failed!");
      console.log("Please either:");
      console.log("1. Install and start local MongoDB");
      console.log("2. Fix MongoDB Atlas connection");
      console.log("3. Update MONGODB_URI in .env file\n");
      process.exit(1);
    }
  }
};

module.exports = connectDB;
