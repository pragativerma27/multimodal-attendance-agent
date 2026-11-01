const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/multimodal_attendance';

  console.log(`[Database] Attempting connection to MongoDB: ${uri.replace(/\/\/.*@/, '//<credentials>@')}`);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(`[Database] Notice: Direct connection to MongoDB failed: ${err.message}`);
    console.warn(`[Database] NOTE: Please verify that MongoDB is running locally (e.g. 'mongod') or provide a valid MONGODB_URI in server/.env for MongoDB Atlas.`);
    console.warn(`[Database] The server will still run and gracefully attempt to reconnect when MongoDB becomes available.`);
    return null;
  }
};

const getStatus = () => {
  return {
    connected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host || 'Disconnected',
    name: mongoose.connection.name || 'multimodal_attendance'
  };
};

module.exports = { connectDB, getStatus };
