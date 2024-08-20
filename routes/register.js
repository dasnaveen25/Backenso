import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  profile,
  user,
  uploadPost,
  uploadImag,
  deletePost, // Ensure this method is defined in your controller
} from "../controllers/registerController.js";
import ValidateToken from "../Middleware/ValidateToken.js";
import upload from "../Middleware/multer.js";

// User routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", ValidateToken, profile);
router.get("/user", ValidateToken, user);
router.get("/register", registerUser);

// Upload routes
router.route("/uploads")
  .get(uploadImag) // Get all uploads
  .post(upload, uploadPost); // Post new uploads

// Delete route for uploads
router.delete("/uploads/:_id",  deletePost);

console.log("Routes configured");

export default router;
