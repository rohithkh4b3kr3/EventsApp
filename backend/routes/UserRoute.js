import express from "express";
import { Register, Login, Logout, GoogleLogin, CompleteClubProfile } from "../middleware/userAuth.js";
import { getMe, getOtherProfile, toggleFollow, searchUsers, updateProfilePhoto } from "../controllers/userController.js";
import isAuthenticated from "../config/auth.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/register", Register);
router.post("/login", Login);
router.post("/google-login", GoogleLogin);
router.get("/logout", Logout);
router.get("/me", isAuthenticated, getMe);
router.get("/profile/:id", isAuthenticated, getOtherProfile);
router.get("/search", isAuthenticated, searchUsers);
router.post("/togglefollow/:id", isAuthenticated, toggleFollow);
router.post("/profile-photo", isAuthenticated, upload.single("photo"), updateProfilePhoto);
router.post("/complete-club-profile", isAuthenticated, CompleteClubProfile);

export default router;
