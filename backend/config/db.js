const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.log('MONGO_URI not set. Running in simulated mode.');
    return false;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully.');
    return true;
  } catch (error) {
    console.log('MongoDB connection failed. Falling back to simulated mode.');
    console.log(error.message);
    return false;
  }
};

module.exports = connectDB;
