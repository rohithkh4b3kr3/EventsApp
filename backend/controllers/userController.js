import User from "../models/UserModel.js";
import Post from "../models/PostModel.js";

export const getMe = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const user = await User.findById(loggedInUserId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Ensure following and followers arrays are included
    const userData = {
      ...user.toObject(),
      following: user.following || [],
      followers: user.followers || [],
    };

    res.status(200).json({
      message: "Profile fetched successfully",
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

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

// Search Users
export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.status(200).json({ success: true, users: [] });
    }

    const searchTerm = q.trim();
    const users = await User.find({
      $or: [
        { username: { $regex: searchTerm, $options: "i" } },
        { name: { $regex: searchTerm, $options: "i" } },
        { clubName: { $regex: searchTerm, $options: "i" } },
      ],
    })
      .select("-password")
      .limit(20);

    res.status(200).json({
      success: true,
      users,
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

    // Check if already following (handle both string and ObjectId comparison)
    const isFollowing = loggedInUser.following.some(
      id => id.toString() === targetUserId
    );

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
