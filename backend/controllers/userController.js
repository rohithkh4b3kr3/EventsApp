import User from "../models/UserModel.js";
import Post from "../models/PostModel.js";

// Get Other User Profile
export const getOtherProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user)
      return res.status(404).json({ msg: "User not found", success: false });

    const posts = await Post.find({ userId: id }).sort({ createdAt: -1 });

    res.status(200).json({
      msg: "User profile fetched successfully",
      success: true,
      user,
      posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error", success: false });
  }
};

// Toggle Follow / Unfollow
export const toggleFollow = async (req, res) => {
  try {
    const loggedInUserId = req.user._id; // from isAuthenticated middleware
    const targetUserId = req.params.id;

    if (loggedInUserId.toString() === targetUserId) {
      return res.status(400).json({ message: "You cannot follow/unfollow yourself", success: false });
    }

    const loggedInUser = await User.findById(loggedInUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Check if already following
    const isFollowing = loggedInUser.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow
      loggedInUser.following = loggedInUser.following.filter(id => id.toString() !== targetUserId);
      targetUser.followers = targetUser.followers.filter(id => id.toString() !== loggedInUserId.toString());
      await loggedInUser.save();
      await targetUser.save();

      return res.status(200).json({ message: "User unfollowed successfully", success: true });
    } else {
      // Follow
      loggedInUser.following.push(targetUserId);
      targetUser.followers.push(loggedInUserId);
      await loggedInUser.save();
      await targetUser.save();

      return res.status(200).json({ message: "User followed successfully", success: true });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};
