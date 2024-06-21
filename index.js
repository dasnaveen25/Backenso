import express from "express";
import registerRouter from "./routes/register.js";
import dbConnection from "./config/dbConnection.js";
import userSchema from "./model/registerModel.js";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = 5000;

// Establish database connection
dbConnection();
// Initialize user schema
userSchema();
  
// Create HTTP server
const server = http.createServer(app);

// Create Socket.io server instance
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174",
    methods: ["GET", "POST"],
    credentials: true, // Corrected 'Credential' to 'credentials'
  },
});

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("Socket Connected");

  socket.on("disconnect", () => {
    console.log("User disconnected"); // Corrected 'Disconnect' to 'disconnect'
  });
});

// Middleware to inject io instance to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Route handlers
app.use("/user", registerRouter);

// Start HTTP server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
