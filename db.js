const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://vyash382:yash1234@cluster0.yvez4if.mongodb.net/Cloudnotes";

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

module.exports = connectToMongo;
