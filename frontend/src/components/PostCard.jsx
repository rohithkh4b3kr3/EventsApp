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
    const shareData = {
      title: `Post by ${author.name || author.username || "User"}`,
      text: post.description?.substring(0, 100) || "Check out this post",
      url: postLink,
    };

    // Use Web Share API if available
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // User cancelled or error occurred, fall back to clipboard
        if (err.name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(postLink);
      showToast();
    } catch (err) {
      console.error("Failed to copy link:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = postLink;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        showToast();
      } catch (fallbackErr) {
        console.error("Fallback copy failed:", fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleAction = async (type) => {
    if (!user) return;
    setActionLoading(true);

    try {
      const route =
        type === "like"
          ? `/post/like/${post._id}`
          : type === "bookmark"
          ? `/post/bookmark/${post._id}`
          : "";

      if (!route) return;
      await axios.put(route);
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
      <article className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-6 rounded-2xl shadow-md border border-slate-200/50 dark:border-slate-700/50 mb-4 hover-lift group relative overflow-hidden">
        {/* Gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold uppercase text-white shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                {author.name?.[0] || author.username?.[0] || "U"}
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white"></div>
            </div>

            <div className="leading-tight">
              <p className="font-bold text-slate-900 dark:text-slate-100 text-base">
                {author.name || "Anonymous User"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                @{author.username || "user"} • {formatDate(post.createdAt)}
              </p>
            </div>
          </div>

          {post.sharedFrom && (
            <span className="text-xs bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-full font-semibold border border-emerald-200/50 dark:border-emerald-700/50 shadow-sm">
              ✨ Shared
            </span>
          )}
        </div>

        <p className="text-slate-800 dark:text-slate-200 mt-4 whitespace-pre-wrap leading-relaxed text-[15px] font-medium">
          {post.description}
        </p>

        {post.image && (
          <div className="mt-5 rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 shadow-md group-hover:shadow-lg transition-all duration-300">
            <img
              src={
                post.image.startsWith("http")
                  ? post.image
                  : `${
                      import.meta.env.VITE_API_URL?.replace(/\/api$/, "") ||
                      "http://localhost:3000"
                    }${post.image}`
              }
              alt="Post"
              className="w-full max-h-[500px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              loading="lazy"
            />
          </div>
        )}

        <div className="flex gap-3 mt-6 text-sm select-none flex-wrap">
          <button
            onClick={() => handleAction("like")}
            disabled={!user || actionLoading}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm transition-all duration-200 font-semibold ${
              isLiked
                ? "bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/30 dark:to-pink-900/30 border-rose-300 dark:border-rose-700 text-rose-600 dark:text-rose-400 shadow-sm"
                : "border-slate-200 dark:border-slate-700 hover:border-rose-400 dark:hover:border-rose-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-900/20 hover:shadow-md"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className="text-xl transition-transform duration-200 hover:scale-110">
              {isLiked ? "❤️" : "🤍"}
            </span>
            <span className="text-slate-700 dark:text-slate-300">{post.like?.length || 0}</span>
          </button>

          <button
            onClick={() => handleAction("bookmark")}
            disabled={!user || actionLoading}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm transition-all duration-200 font-semibold ${
              isBookmarked
                ? "bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 shadow-sm"
                : "border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 hover:shadow-md"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className="text-xl transition-transform duration-200 hover:scale-110">
              {isBookmarked ? "🔖" : "⭐"}
            </span>
            <span className="text-slate-700 dark:text-slate-300">{post.bookmark?.length || 0}</span>
          </button>

          <button
            onClick={handleShare}
            disabled={actionLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-sm transition-all duration-200 font-semibold hover:border-emerald-400 dark:hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300"
            title="Share this post"
          >
            <span className="text-xl transition-transform duration-200 hover:scale-110">🔗</span>
            <span>Share</span>
          </button>
        </div>
      </article>

      {/* Toast Notification */}
      {toastVisible && (
        <div className="fixed bottom-6 right-6 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl z-50 animate-fade-in flex items-center gap-3 border border-slate-700/50 dark:border-slate-600/50">
          <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center">
            <span className="text-xs">✓</span>
          </div>
          <p className="text-sm font-semibold">Link copied!</p>
        </div>
      )}
    </>
  );
}
