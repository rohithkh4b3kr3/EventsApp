import express from "express";
import { Register , Login ,Logout } from "../middleware/userAuth.js";
// import { Login } from "../controllers/userAuth.js";
import { getOtherProfile, toggleFollow } from "../controllers/userController.js";
import isAuthenticated from "../config/auth.js";
const router = express.Router();


router.post("/register", Register);
router.post("/login", Login);
router.get("/logout", Logout);
// router.get("/createPost" , isAuthenticated , createPost);
router.get("/profile/:id",isAuthenticated,getOtherProfile);
router.post("/togglefollow/:id",isAuthenticated,toggleFollow)


export default router;
