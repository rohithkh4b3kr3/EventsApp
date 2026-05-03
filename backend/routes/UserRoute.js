import express from "express";
import { Register, Login, Logout, GoogleLogin, CompleteClubProfile } from "../middleware/userAuth.js";
import { getMe, getOtherProfile, toggleFollow, searchUsers, updateProfilePhoto } from "../controllers/userController.js";
import isAuthenticated from "../config/auth.js";

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/google-login", GoogleLogin);
router.get("/logout", Logout);
router.get("/me", isAuthenticated, getMe);
router.get("/profile/:id", isAuthenticated, getOtherProfile);
router.get("/search", isAuthenticated, searchUsers);
router.post("/togglefollow/:id", isAuthenticated, toggleFollow);
router.post("/profile-photo", isAuthenticated, updateProfilePhoto);
router.post("/complete-club-profile", isAuthenticated, CompleteClubProfile);

export default router;
