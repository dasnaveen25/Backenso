import bcrypt from "bcrypt";
import registerModel from "../model/registerModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import postModel from "../model/postModel.js";
import cloudinary from "cloudinary";

dotenv.config();

const registerUser = async (req, res) => {
  const { io } = req;
  const { name, mobile, password } = req.body;

  if (!name || !mobile || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const userExists = await registerModel.findOne({ mobile });
    if (userExists) {
      io.emit("login", { message: "User already exists" });
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashedPassword", hashedPassword);

    const user = await registerModel.create({
      name,
      mobile,
      password: hashedPassword,
    });

    if (user) {
      io.emit("login", { message: "User created successfully" });
      res.status(201).json({
        _id: user._id,
        name: user.name,
        mobile: user.mobile,
      });
      console.log("User created successfully", user);
    } else {
      res.status(400).json({ message: "User creation failed" });
    }
  } catch (error) {
    console.error("Registration Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { io } = req;
  const { mobile, password } = req.body;

  try {
    if (!mobile || !password) {
      io.emit("login", { message: "Please provide both mobile and password" });
      return res
        .status(400)
        .json({ message: "Please provide both mobile and password" });
    }

    const user = await registerModel.findOne({ mobile });

    if (!user) {
      io.emit("login", { message: "User not found" });
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      io.emit("login", { message: "Invalid credentials" });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10d" }
    );

    io.emit("login", { message: "Login naveen" });
    res.status(200).json({ token });
  } catch (error) {
    console.error("Login Error:", error.message);
    io.emit("login", { message: error.message });
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

// const uploadPost = async (req, res) => {
//   try {
//     console.log("req.file", req.file);
//     const newImage = new Image({
//       imageUrl: req.file.path,
//       text: req.body.text,
//     });
//     console.log("newImage", newImage);
//     const imageUpload = await cloudinary.v2.uploader.upload(req.file.path);
//     console.log("imageUpload", imageUpload);
//     const data = await postModel.create({
//       imageUrl: imageUpload.secure_url,
//       text: req.body.text,
//     });
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const uploadPost = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("req.file", req.file);

    const { text } = req.body;
    // Assuming Image is your Mongoose model
    // const newImage = new Image({
    //   imageUrl: req.file.path,
    //   text: req.body.text,
    // });

    // console.log("newImage", newImage);

    // Upload image to Cloudinary
    const imageUpload = await cloudinary.v2.uploader.upload(req.file.path);
    console.log("imageUpload", imageUpload);

    // Create new post with Cloudinary URL
    const data = await postModel.create({
      image: imageUpload.secure_url,
      text,
    });

    if (data) {
      res.status(201).send(data);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const uploadImag = async (req, res) => {
  const data = await postModel.find();
  res.send(data);
};

export { registerUser, loginUser, profile, user, uploadPost, uploadImag };
