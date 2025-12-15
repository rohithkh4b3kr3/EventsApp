import { useContext, useState } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function PostCard({ post, onRefresh }) {
  const { user } = useContext(AuthContext);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const author = post.userId || {};

  const showToast = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  const handleShare = async () => {
    const postLink = `${window.location.origin}/post/${post._id}`;
    try {
      await navigator.clipboard.writeText(postLink);
      showToast();
    } catch {}
  };

  const handleAction = async (type) => {
    if (!user) return;
    setActionLoading(true);
    try {
      await axios.put(type === "like"
        ? `/post/like/${post._id}`
        : `/post/bookmark/${post._id}`
      );
      onRefresh?.();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const isLiked = user ? post.like?.includes(user._id) : false;
  const isBookmarked = user ? post.bookmark?.includes(user._id) : false;

  return (
    <>
      <article className="bg-slate-900/40 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-slate-700 mb-4 transition-all duration-300 hover:shadow-emerald-600/20 hover:scale-[1.01]">
        <div className="flex items-start gap-3 mb-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold uppercase text-white shadow-lg">
            {author.name?.[0] || author.username?.[0] || "U"}
          </div>

          <div>
            <p className="font-bold text-slate-100 text-base">{author.name}</p>
            <p className="text-xs text-slate-400">@{author.username} • {formatDate(post.createdAt)}</p>
          </div>
        </div>

        <p className="text-slate-200 mt-2 whitespace-pre-wrap leading-relaxed text-[15px] font-medium">
          {post.description}
        </p>

        {post.image && (
          <div className="mt-5 rounded-xl overflow-hidden border border-slate-700 shadow-md">
            <img
              src={post.image.startsWith("http") ? post.image : `${import.meta.env.VITE_API_URL?.replace(/\/api$/, "")}${post.image}`}
              alt="Post"
              className="w-full max-h-[500px] object-cover"
            />
          </div>
        )}

        <div className="flex gap-3 mt-6 text-sm select-none flex-wrap">
          
          {/* LIKE */}        
          <button
            onClick={() => handleAction("like")}
            disabled={!user || actionLoading}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold border transition-all ${
              isLiked
                ? "border-rose-600 text-rose-400 bg-rose-900/30"
                : "border-slate-600 text-slate-300 hover:border-rose-500 hover:text-rose-400"
            }`}
          >
            {isLiked ? "❤️" : "🤍"} {post.like?.length || 0}
          </button>

          {/* BOOKMARK */}
          <button
            onClick={() => handleAction("bookmark")}
            disabled={!user || actionLoading}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold border transition-all ${
              isBookmarked
                ? "border-emerald-600 text-emerald-400 bg-emerald-900/20"
                : "border-slate-600 text-slate-300 hover:border-emerald-500 hover:text-emerald-400"
            }`}
          >
            {isBookmarked ? "🔖" : "⭐"} {post.bookmark?.length || 0}
          </button>

          {/* SHARE */}
          <button
            onClick={handleShare}
            disabled={actionLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-600 text-slate-300 transition-all hover:border-emerald-500 hover:text-emerald-400"
          >
            🔗 Share
          </button>
        </div>
      </article>
    </>
  );
}
