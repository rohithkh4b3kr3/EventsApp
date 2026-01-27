import express from "express";
import isAuthenticated from "../config/auth.js";
import {
  getClubChatMessages,
  joinClubChat,
  leaveClubChat,
  listMyClubChats,
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/my-clubs", isAuthenticated, listMyClubChats);
router.post("/club/:clubId/join", isAuthenticated, joinClubChat);
router.post("/club/:clubId/leave", isAuthenticated, leaveClubChat);
router.get("/club/:clubId/messages", isAuthenticated, getClubChatMessages);

export default router;
