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
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold uppercase">
          {user.name?.[0] || user.username?.[0] || "U"}
        </div>
        <div className="leading-tight">
          <p className="font-semibold text-slate-900">{user.name}</p>
          <p className="text-xs text-slate-500">@{user.username}</p>
          <p className="text-xs text-slate-500 mt-1">
            {user.followers?.length || 0} followers · {user.following?.length || 0} following
          </p>
        </div>
      </div>
      {!isCurrentUser && (
        <button
          onClick={toggleFollow}
          disabled={loading}
          className={`px-3 py-1.5 rounded-lg text-sm transition ${
            isFollowing
              ? "border border-slate-200 text-slate-700 hover:border-slate-300"
              : "bg-emerald-600 text-white hover:bg-emerald-700"
          }`}
        >
          {loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}
    </div>
  );
}
