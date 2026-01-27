import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const buildAuthCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000,
});

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
      profilePhoto: existingUser.profilePhoto,
      followers: existingUser.followers || [],
      following: existingUser.following || [],
    };

    res
      .status(200)
      .cookie("token", token, buildAuthCookieOptions())
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
    .cookie("token", "", { ...buildAuthCookieOptions(), expires: new Date(0) })
    .status(200)
    .json({ message: "Logout successful" });
};

export const GoogleLogin = async (req, res) => {
  try {
    const { credential, userType } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: "Google login not configured" });
    }

    const tokenInfoRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
    );

    if (!tokenInfoRes.ok) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    const tokenInfo = await tokenInfoRes.json();
    if (tokenInfo.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(401).json({ message: "Google token audience mismatch" });
    }

    const email = tokenInfo.email;
    const name = tokenInfo.name || "User";
    const picture = tokenInfo.picture;
    const requestedType = userType === "club" ? "club" : "user";

    if (!email) {
      return res.status(400).json({ message: "Google account email is required" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      const baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");
      let username = baseUsername || `user${Date.now()}`;
      let suffix = 0;
      while (await User.findOne({ username })) {
        suffix += 1;
        username = `${baseUsername}${suffix}`;
      }

      user = await User.create({
        name,
        username,
        email,
        password: await bcrypt.hash(String(Date.now()), 10),
        userType: requestedType,
        profilePhoto: picture,
      });
    } else {
      if (requestedType === "club" && user.userType !== "club") {
        user.userType = "club";
      }

      if (picture && !user.profilePhoto) {
        user.profilePhoto = picture;
      }

      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const userData = {
      id: user._id,
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      userType: user.userType || "user",
      clubName: user.clubName,
      profilePhoto: user.profilePhoto,
      followers: user.followers || [],
      following: user.following || [],
    };

    const needsClubName = user.userType === "club" && !user.clubName;

    res
      .status(200)
      .cookie("token", token, buildAuthCookieOptions())
      .json({
        message: "Login successful",
        user: userData,
        token,
        needsClubName,
      });
  } catch (error) {
    console.error("Error in GoogleLogin:", error);
    return res.status(500).json({ message: "Error in Google login" });
  }
};

export const CompleteClubProfile = async (req, res) => {
  try {
    const { clubName } = req.body;
    const loggedInUserId = req.user._id;

    if (!clubName || !clubName.trim()) {
      return res.status(400).json({ message: "Club name is required" });
    }

    const user = await User.findById(loggedInUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.userType !== "club") {
      return res.status(400).json({ message: "Not a club account" });
    }

    if (user.clubName) {
      const safeUser = await User.findById(user._id).select("-password");
      return res.status(200).json({
        message: "Club profile already completed",
        success: true,
        user: safeUser,
      });
    }

    user.clubName = clubName.trim();
    user.name = clubName.trim();
    await user.save();

    const safeUser = await User.findById(user._id).select("-password");
    return res.status(200).json({
      message: "Club profile completed",
      success: true,
      user: safeUser,
    });
  } catch (error) {
    console.error("Error in CompleteClubProfile:", error);
    return res.status(500).json({ message: "Error completing club profile" });
  }
};
