import mongoose from "mongoose";

// Define the schema
const postData = new mongoose.Schema({
  photo: {
    type: String,
  },

  text: {
    type: String,
  },
});

// Create a model
const postModel = mongoose.model("User", postData);

// Export the model
export default postModel;
