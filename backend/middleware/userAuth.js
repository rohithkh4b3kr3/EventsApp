import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// REGISTER
export const Register = async (req, res) => {
  try {
    const { email, password, name, username, userType, clubName } = req.body;

    if (!email || !password || !name || !username) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // If registering as club, require clubName
    if (userType === 'club' && !clubName) {
      return res.status(400).json({ message: "Club name is required for club registration" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name: userType === 'club' ? clubName : name,
      username,
      email,
      password: hashedPassword,
      userType: userType || 'user',
    };

    if (userType === 'club') {
      userData.clubName = clubName;
    }

    await User.create(userData);
    return res.status(201).json({ message: "Account registered successfully" });
  } catch (error) {
    console.error("Error in registering user:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email or username already exists" });
    }
    return res.status(500).json({ message: "Error in registering user" });
  }
};

// LOGIN
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const existingUser = await User.findOne({ email }).select("+password"); // FIXED
    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const userData = {
      id: existingUser._id,
      _id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      username: existingUser.username,
      userType: existingUser.userType || 'user',
      clubName: existingUser.clubName,
      followers: existingUser.followers || [],
      following: existingUser.following || [],
    };

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Login successful",
        user: userData,
        token,
      });
  } catch (error) {
    console.error("Error in logging in user:", error);
    return res.status(500).json({ message: "Error in logging in user" });
  }
};

// LOGOUT
export const Logout = (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .status(200)
    .json({ message: "Logout successful" });
};
