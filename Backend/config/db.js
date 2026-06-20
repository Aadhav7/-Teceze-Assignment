const mongoose = require('mongoose');

let connectionPromise = null;

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not configured.');
    }

    if (connectionPromise) {
      return connectionPromise;
    }

    connectionPromise = mongoose.connect(process.env.MONGO_URI);
    const conn = await connectionPromise;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    connectionPromise = null;
    console.error(`Database connection error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
