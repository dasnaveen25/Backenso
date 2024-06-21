import bcrypt from "bcrypt";
import registerModel from "../model/registerModel.js";
import jwt from "jsonwebtoken";
import express from "express";
import cors from "cors";
// import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const registerUser = async (req, res) => {
  const { name, mobile, password } = req.body;

  if (!name || !mobile || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const userExists = await registerModel.findOne({ mobile });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
    io.emit("erorr", error);
  }

  // Hash the password
  const hashepassword = await bcrypt.hash(password, 10);
  console.log("hashepassword", hashepassword);

  const user = await registerModel.create({
    name,
    mobile,
    password: hashepassword,
  });

  // check if user already exists
  if (!user) {
    res.status(400).json({
      _id: user._id,
      name: user.name,
      mobile: user.mobile,
    });
    console.log("user created successfully", user);
  } else {
    res.status(400).json({ message: "User already exists" });
  }
};

const loginUser = async (req, res) => {
  const { mobile, password } = req.body;

  try {
    if (!mobile || !password) {
      res.status(400);
      throw new Error("Please provide both mobile and password");
    }

    const user = await registerModel.findOne({ mobile });

    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400);
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(400).json({ message: error.message });
  }
};

const profile = async (req, res) => {
  const userData = req.user;
  console.log("req.user._id", req.user.id);
  const user = await registerModel.findById(userData.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(user);
};

const user = async (req, res) => {
  const userData = req.user;
  console.log("req.user._id", req.user.id);
  const user = await registerModel.findById(userData.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(user);
};

// create a new user

export { registerUser, loginUser, profile, user };
