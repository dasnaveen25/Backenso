import mongoose from "mongoose";

// Define the schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },

  mobile: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
});

// Create a model
const registerModel = mongoose.model("User", userSchema);

// Export the model
export default registerModel;
