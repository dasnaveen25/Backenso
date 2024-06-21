// routes/registerRoutes.js
import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  profile,
  user,
} from "../controllers/registerController.js";
import ValidateToken from "../Middleware/ValidateToken.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", ValidateToken, profile);
router.get("/user", ValidateToken, user);

export default router;
