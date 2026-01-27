import mongoose from "mongoose";
import User from "../models/UserModel.js";
import ClubChatMessage from "../models/ClubChatMessageModel.js";

export const listMyClubChats = async (req, res) => {
  try {
    const me = req.user;
    let clubIds = me.joinedClubChats || [];

    // Club accounts should always see their own club chat room
    if (me.userType === "club") {
      const hasSelf = clubIds.some((id) => id.toString() === me._id.toString());
      if (!hasSelf) clubIds = [me._id, ...clubIds];
    }

    const clubs = await User.find({
      _id: { $in: clubIds },
      userType: "club",
    }).select("name username clubName profilePhoto userType");

    res.status(200).json({ success: true, clubs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const joinClubChat = async (req, res) => {
  try {
    const { clubId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return res.status(400).json({ success: false, message: "Invalid club id" });
    }

    const club = await User.findById(clubId).select("_id userType");
    if (!club || club.userType !== "club") {
      return res.status(404).json({ success: false, message: "Club not found" });
    }

    const me = await User.findById(req.user._id);
    const joined = me.joinedClubChats || [];

    const already = joined.some((id) => id.toString() === clubId);
    if (!already) {
      joined.push(clubId);
      me.joinedClubChats = joined;
      await me.save();
    }

    res.status(200).json({ success: true, message: "Joined club chat" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const leaveClubChat = async (req, res) => {
  try {
    const { clubId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return res.status(400).json({ success: false, message: "Invalid club id" });
    }

    const me = await User.findById(req.user._id);
    me.joinedClubChats = (me.joinedClubChats || []).filter((id) => id.toString() !== clubId);
    await me.save();

    res.status(200).json({ success: true, message: "Left club chat" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getClubChatMessages = async (req, res) => {
  try {
    const { clubId } = req.params;
    const limit = Math.min(Number(req.query.limit) || 50, 100);

    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return res.status(400).json({ success: false, message: "Invalid club id" });
    }

    // Club owner can always view its own room
    if (req.user.userType !== "club" || req.user._id.toString() !== clubId) {
      const me = await User.findById(req.user._id).select("joinedClubChats");
      const isJoined = (me.joinedClubChats || []).some((id) => id.toString() === clubId);
      if (!isJoined) {
        return res.status(403).json({ success: false, message: "Join the club chat first" });
      }
    }

    const messages = await ClubChatMessage.find({ clubId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("senderId", "name username profilePhoto userType clubName");

    res.status(200).json({ success: true, messages: messages.reverse() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
