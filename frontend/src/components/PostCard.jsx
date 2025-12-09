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
    <article className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-4 transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-emerald-600/10 text-emerald-700 flex items-center justify-center font-bold uppercase">
            {author.name?.[0] || author.username?.[0] || "U"}
          </div>

          <div className="leading-tight">
            <p className="font-semibold text-slate-900">
              {author.name || "Anonymous User"}
            </p>
            <p className="text-xs text-slate-500">
              @{author.username || "user"} • {formatDate(post.createdAt)}
            </p>
          </div>
        </div>

        {post.sharedFrom && (
          <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md font-medium">
            Shared
          </span>
        )}
      </div>

      <p className="text-slate-800 mt-4 whitespace-pre-wrap leading-relaxed">
        {post.description}
      </p>

      {post.image && (
        <div className="mt-4">
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
            className="rounded-xl border border-slate-200 max-h-96 w-full object-cover transition hover:opacity-95"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex gap-4 mt-5 text-sm select-none flex-wrap">
        <button
          onClick={() => handleAction("like")}
          disabled={!user || actionLoading}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition font-medium ${
            isLiked
              ? "bg-rose-50 border-rose-200 text-rose-600"
              : "border-slate-200 hover:border-rose-500 hover:text-rose-600"
          } disabled:opacity-50`}
        >
          <span className="text-lg">{isLiked ? "❤️" : "🤍"}</span>
          <span>{post.like?.length || 0}</span>
        </button>

        <button
          onClick={() => handleAction("bookmark")}
          disabled={!user || actionLoading}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition font-medium ${
            isBookmarked
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "border-slate-200 hover:border-emerald-500 hover:text-emerald-700"
          } disabled:opacity-50`}
        >
          <span className="text-lg">{isBookmarked ? "🔖" : "⭐"}</span>
          <span>{post.bookmark?.length || 0}</span>
        </button>

        <button
          onClick={handleShare}
          disabled={actionLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition font-medium border-slate-200 hover:border-emerald-500 hover:text-emerald-700 disabled:opacity-50"
          title="Share this post"
        >
          <span className="text-lg">🔗</span>
          <span>Share</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastVisible && (
        <div className="fixed bottom-4 right-4 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in flex items-center gap-2">
          <span>✓</span>
          <p className="text-sm font-medium">Link copied</p>
        </div>
      )}
    </article>
  );
}
