import mongoose from "mongoose";

// Define the schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  mobile: {
    type: String,
  },
  password: {
    type: String,
  },
});

// Create a model
const registerModel = mongoose.model("User", userSchema);

// Export the model
export default registerModel;
