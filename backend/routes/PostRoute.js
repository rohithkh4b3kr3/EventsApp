import express from "express";
import {
  createPost,
  deletePost,
  likeOrDislike,
  addComment,
  bookmarkPost,
  getAllPosts,
  getPostById,
  getUserPosts,
  getFollowingPosts,
  sharePost,
} from "../controllers/postController.js";
import isAuthenticated from "../config/auth.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.post("/create", isAuthenticated, upload.single("image"), createPost);
router.delete("/delete/:id", isAuthenticated, deletePost);
router.put("/like/:id", isAuthenticated, likeOrDislike);
router.put("/comment/:id", isAuthenticated, addComment);
router.put("/bookmark/:id", isAuthenticated, bookmarkPost);
router.get("/all", isAuthenticated, getAllPosts);
router.get("/:id", isAuthenticated, getPostById);
router.get("/user/:userId", isAuthenticated, getUserPosts);
router.get("/followingpost/:id", isAuthenticated, getFollowingPosts);
router.post("/sharepost/:id", isAuthenticated, sharePost);

// router.get("/user/:userId", isAuthenticated, getUserProfile);
// router.get("/profile/:id",getOtherProfile);


export default router;
