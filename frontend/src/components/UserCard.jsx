import { useContext, useState, useEffect } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function UserCard({ user, isCurrentUser, onRefresh }) {
  const { user: loggedInUser, refreshUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (loggedInUser?.following && user?._id) {
      const following = loggedInUser.following.some(
        (id) => id.toString() === user._id.toString()
      );
      setIsFollowing(following);
    }
  }, [loggedInUser?.following, user?._id]);

  const toggleFollow = async () => {
    if (!loggedInUser || isCurrentUser) return;
    setLoading(true);
    try {
      const response = await axios.post(`/user/togglefollow/${user._id}`);
      if (response.data.success) {
        await refreshUser();
        setIsFollowing(!isFollowing);
        onRefresh?.();
      }
    } catch (err) {
      console.error("Follow error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
      <div className="flex items-center justify-between gap-4">
        <Link 
          to={`/profile/${user._id}`}
          className="flex items-center gap-3 flex-1 min-w-0"
        >
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center font-semibold uppercase text-white text-sm flex-shrink-0">
            {user.name?.[0] || user.username?.[0] || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-[15px] text-slate-900 dark:text-white truncate">{user.name}</p>
            <p className="text-[15px] text-slate-500 dark:text-slate-400 truncate">@{user.username}</p>
            {user.followers && (
              <p className="text-[15px] text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="font-semibold">{user.followers.length || 0}</span> followers
              </p>
            )}
          </div>
        </Link>
        {!isCurrentUser && loggedInUser && (
          <button
            onClick={toggleFollow}
            disabled={loading}
            className={`px-4 h-8 rounded-full text-sm font-bold transition-all flex-shrink-0 ${
              isFollowing
                ? "border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:border-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-slate-200"
            } disabled:opacity-50`}
          >
            {loading ? "..." : isFollowing ? "Following" : "Follow"}
          </button>
        )}
      </div>
    </div>
  );
}
