import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

export default dbConnection;
