// routes/registerRoutes.js
import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  profile,
  user,
  uploadPost,
} from "../controllers/registerController.js";
import ValidateToken from "../Middleware/ValidateToken.js";
import upload from "../Middleware/multer.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", ValidateToken, profile);
router.get("/user", ValidateToken, user);
// router.post("/upload", upload, uploadPost);

router.route("/upload").post(upload, uploadPost);
console.log("uploadPost", uploadPost);

export default router;
