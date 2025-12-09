import { useContext, useState } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function UserCard({ user, isCurrentUser, onRefresh }) {
  const { user: loggedInUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const toggleFollow = async () => {
    if (!loggedInUser || isCurrentUser) return;
    setLoading(true);
    try {
      await axios.post(`/user/togglefollow/${user._id}`);
      onRefresh?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isFollowing = loggedInUser?.following?.includes(user._id);

  return (
    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-6 flex items-center justify-between gap-4 hover-lift">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold uppercase text-white shadow-lg">
            {user.name?.[0] || user.username?.[0] || "U"}
          </div>
          <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full border-2 border-white"></div>
        </div>
        <div className="leading-tight">
          <p className="font-bold text-slate-900 dark:text-slate-100 text-lg">{user.name}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">@{user.username}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-semibold">
            <span className="text-emerald-600 dark:text-emerald-400">{user.followers?.length || 0}</span> followers ·{" "}
            <span className="text-emerald-600 dark:text-emerald-400">{user.following?.length || 0}</span> following
          </p>
        </div>
      </div>
      {!isCurrentUser && (
        <button
          onClick={toggleFollow}
          disabled={loading}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-md hover:shadow-lg ${
            isFollowing
              ? "border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
              : "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white hover:scale-105"
          } disabled:opacity-50`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
            </span>
          ) : isFollowing ? (
            "Unfollow"
          ) : (
            "Follow"
          )}
        </button>
      )}
    </div>
  );
}
