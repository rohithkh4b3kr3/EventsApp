import Post from "../models/PostModel.js";
import User from "../models/UserModel.js";

// CREATE POST 
export const createPost = async (req, res) => {
  try {
    const { description, picturePath } = req.body;
    const userId = req.user._id; // logged-in user

    if (!description)
      return res.status(400).json({ msg: "Please provide a description", success: false });

    const newPost = await Post.create({
      description,
      image: picturePath || "",
      userId,
    });

    res.status(201).json({
      msg: "Post created successfully",
      success: true,
      post: newPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error", success: false });
  }
};

// DELETE POST 
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findOneAndDelete({ _id: postId, userId });
    if (!post)
      return res.status(404).json({ msg: "Post not found or not authorized", success: false });

    res.status(200).json({ msg: "Post deleted successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error", success: false });
  }
};

// LIKE / DISLIKE POST 
export const likeOrDislike = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ msg: "Post not found", success: false });

    const isLiked = post.like.includes(userId);

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { [isLiked ? "$pull" : "$push"]: { like: userId } },
      { new: true }
    );

    res.status(200).json({
      msg: isLiked ? "Post disliked successfully" : "Post liked successfully",
      success: true,
      post: updatedPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error", success: false });
  }
};

// COMMENT
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user._id;
    const postId = req.params.id;

    if (!text) return res.status(400).json({ msg: "Comment text required", success: false });

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: { userId, text } } },
      { new: true }
    );

    res.status(200).json({
      msg: "Comment added successfully",
      success: true,
      post: updatedPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error", success: false });
  }
};

// BOOKMARK
export const bookmarkPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ msg: "Post not found", success: false });

    const isBookmarked = post.bookmark.includes(userId);

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { [isBookmarked ? "$pull" : "$push"]: { bookmark: userId } },
      { new: true }
    );

    res.status(200).json({
      msg: isBookmarked ? "Post removed from bookmarks" : "Post bookmarked successfully",
      success: true,
      post: updatedPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error", success: false });
  }
};

// GET ALL POSTS
export const getAllPosts = async (req, res) => {
  try {
    const userId = req.user._id; 

    const loggedInUser = await User.findById(userId);
    if (!loggedInUser) {
      return res.status(404).json({ msg: "User not found", success: false });
    }

    
    const followingIds = [...loggedInUser.following, userId];

    const posts = await Post.find({ userId: { $in: followingIds } })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error", success: false });
  }
};


// GET SINGLE POST
export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ msg: "Post not found", success: false });

    res.status(200).json({ success: true, post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error", success: false });
  }
};

// GET POSTS OF LOGGED-IN USER
export const getUserPosts = async (req, res) => {
  try {
    const userId = req.user._id; // logged-in user
    const posts = await Post.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error", success: false });
  }
};


// GET POSTS OF FOLLOWED USERS
export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const loggedInUser = await User.findById(userId);

    if (!loggedInUser) {
      return res.status(404).json({ msg: "User not found", success: false });
    }

    const followingUserPosts = await Promise.all(
      loggedInUser.following.map((otherUserId) => {
        return Post.find({ userId: otherUserId }).sort({ createdAt: -1 });
      })
    );

    const allPosts = followingUserPosts.flat();

    res.status(200).json({
      msg: "Following users' posts fetched successfully",
      success: true,
      posts: allPosts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error", success: false });
  }
};
