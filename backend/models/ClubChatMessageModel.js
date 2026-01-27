import mongoose from "mongoose";

const clubChatMessageSchema = new mongoose.Schema(
  {
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

clubChatMessageSchema.index({ clubId: 1, createdAt: -1 });

const ClubChatMessage = mongoose.model("ClubChatMessage", clubChatMessageSchema);
export default ClubChatMessage;
