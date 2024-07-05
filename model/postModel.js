import mongoose from "mongoose";

// Define the schema
const postData = new mongoose.Schema({
  image: {
    type: String,
  },

  text: {
    type: String,
  },
});

// Create a model
const postModel = mongoose.model("UserPost", postData);

// Export the model
export default postModel;
