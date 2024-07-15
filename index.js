import express from "express";
import registerRouter from "./routes/register.js";
import dbConnection from "./config/dbConnection.js";
import userSchema from "./model/registerModel.js";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cloudinary from "cloudinary";
import multer from "multer";

// // import CloudinaryStorage from "multer-storage-cloudinary";

dotenv.config();
const app = express();
app.use(bodyParser.json());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// // Configure CORS to allow multiple origins
const corsOptions = {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST"],
  credentials: true,
};
app.use(cors(corsOptions));

const PORT = 5000;

// Establish database connection
dbConnection();
// Initialize user schema
userSchema();

// Create HTTP server
const server = http.createServer(app);

// Create Socket.io server instance
const io = new Server(server, {
  cors: corsOptions,
});

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("Socket Connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Middleware to inject io instance to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Route handlers
app.get("/", (req, res) => {
  res.send("hello world");
});
app.use("/user", registerRouter);

// Start HTTP server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export { io };
