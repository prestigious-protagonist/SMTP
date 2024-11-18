const mongoose = require("mongoose");
const { MONGO_URL } = require("../config/config");

const connectDB =async () => {
    try {
        const conn = await mongoose.connect(MONGO_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
      } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); 
      }
}

module.exports = connectDB;
