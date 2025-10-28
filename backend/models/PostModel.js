import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    description: { type: String, required: true },
    image: { type: String },
    like: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },},],
    bookmark: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
