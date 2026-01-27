import express from "express";
import dotenv from "dotenv";
import cookiesParser from "cookie-parser";
import http from "http";
import jwt from "jsonwebtoken";
import { Server as SocketIOServer } from "socket.io";
import UserRoute from "./routes/UserRoute.js";
import PostRoute from "./routes/PostRoute.js";
import ChatRoute from "./routes/ChatRoute.js";
import dbConnection from "./config/db.js";
import User from "./models/UserModel.js";
import ClubChatMessage from "./models/ClubChatMessageModel.js";
import cors from "cors";
import path from "path";
import fs from "fs";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookiesParser());

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

dbConnection();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/user", UserRoute);
app.use("/api/post", PostRoute);
app.use("/api/chat", ChatRoute);

const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

const parseCookies = (cookieHeader) => {
  const cookies = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(";").forEach((part) => {
    const [rawKey, ...rawVal] = part.trim().split("=");
    if (!rawKey) return;
    const key = decodeURIComponent(rawKey);
    const val = decodeURIComponent(rawVal.join("="));
    cookies[key] = val;
  });
  return cookies;
};

io.use(async (socket, next) => {
  try {
    const cookies = parseCookies(socket.request.headers.cookie);
    const token = cookies.token;
    if (!token) return next(new Error("UNAUTHORIZED"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return next(new Error("UNAUTHORIZED"));

    socket.user = user;
    return next();
  } catch (err) {
    return next(new Error("UNAUTHORIZED"));
  }
});

io.on("connection", (socket) => {
  socket.on("join_club_chat", async ({ clubId }) => {
    try {
      if (!clubId) return;
      // Club owner can always join its own room
      if (!(socket.user.userType === "club" && socket.user._id.toString() === clubId)) {
        const me = await User.findById(socket.user._id).select("joinedClubChats");
        const isJoined = (me.joinedClubChats || []).some((id) => id.toString() === clubId);
        if (!isJoined) return;
      }

      socket.join(`club:${clubId}`);
    } catch {
      // ignore
    }
  });

  socket.on("leave_club_chat", ({ clubId }) => {
    if (!clubId) return;
    socket.leave(`club:${clubId}`);
  });

  socket.on("send_message", async ({ clubId, text }) => {
    try {
      const clean = typeof text === "string" ? text.trim() : "";
      if (!clubId || !clean) return;

      const me = await User.findById(socket.user._id).select("joinedClubChats name username profilePhoto userType clubName");
      // Club owner can always send in its own room
      if (!(me.userType === "club" && me._id.toString() === clubId)) {
        const isJoined = (me.joinedClubChats || []).some((id) => id.toString() === clubId);
        if (!isJoined) return;
      }

      const msg = await ClubChatMessage.create({
        clubId,
        senderId: me._id,
        text: clean,
      });

      io.to(`club:${clubId}`).emit("message_new", {
        _id: msg._id,
        clubId,
        text: msg.text,
        createdAt: msg.createdAt,
        sender: {
          _id: me._id,
          name: me.name,
          username: me.username,
          profilePhoto: me.profilePhoto,
          userType: me.userType,
          clubName: me.clubName,
        },
      });
    } catch {
      // ignore
    }
  });
});

server.listen(port, () => {
  console.log(`App is running on port ${port}`);
  console.log("Loaded MONGO_URI from ENV:", process.env.MONGO_URI);
});
