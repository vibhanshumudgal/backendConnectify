const mongoose = require("mongoose");
require("dotenv").config();
const connectionString = process.env.connectionString;

const DbConnectFunction = async () => {
  try {
    await mongoose.connect(connectionString);
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1); 
  }
};

module.exports = DbConnectFunction;
