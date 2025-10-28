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
  
  
} from "../controllers/postController.js";
import isAuthenticated from "../config/auth.js";

const router = express.Router();

router.post("/create", isAuthenticated, createPost);
router.delete("/delete/:id", isAuthenticated, deletePost);
router.put("/like/:id", isAuthenticated, likeOrDislike);
router.put("/comment/:id", isAuthenticated, addComment);
router.put("/bookmark/:id", isAuthenticated, bookmarkPost);
router.get("/all", isAuthenticated, getAllPosts);
router.get("/:id", isAuthenticated, getPostById);
router.get("/user/:userId", isAuthenticated, getUserPosts);
router.get("/followingpost/:id", isAuthenticated, getFollowingPosts);

// router.get("/user/:userId", isAuthenticated, getUserProfile);
// router.get("/profile/:id",getOtherProfile);


export default router;
