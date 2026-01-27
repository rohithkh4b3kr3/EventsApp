import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContextContext";

const getAvatarUrl = (photoPath) => {
  if (!photoPath) return "";
  if (photoPath.startsWith("http")) return photoPath;
  const base = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/api$/, "");
  return `${base}${photoPath}`;
};

export default function Chats() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchChats = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/chat/my-clubs");
      setClubs(res.data.clubs || []);
    } catch (err) {
      setError(err?.friendlyMessage || "Could not load chats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user) fetchChats();
  }, [authLoading, user, fetchChats]);

  const content = useMemo(() => {
    if (authLoading) {
      return (
        <div className="flex items-center justify-center py-24">
          <div className="h-10 w-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      );
    }

    if (!user) {
      return (
        <div className="max-w-[650px] mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Chats</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Login to view your club chats.</p>
          <Link
            to="/login"
            className="inline-flex mt-6 px-5 h-11 items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
          >
            Go to Login
          </Link>
        </div>
      );
    }

    return (
      <div className="max-w-[650px] mx-auto border-x border-slate-100 dark:border-slate-900 min-h-screen bg-white dark:bg-black">
        <header className="sticky top-0 z-30 bg-white/70 dark:bg-black/70 backdrop-blur-md border-b border-slate-100 dark:border-slate-900 px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Chats</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Club group conversations</p>
          </div>
          <button
            onClick={fetchChats}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            aria-label="Refresh"
          >
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </header>

        {loading && (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-slate-100 dark:border-slate-900 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-900" />
                  <div className="flex-1">
                    <div className="h-3 w-1/3 rounded bg-slate-100 dark:bg-slate-900" />
                    <div className="mt-2 h-3 w-1/2 rounded bg-slate-100 dark:bg-slate-900" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="m-4 p-4 bg-red-50 dark:bg-red-500/10 rounded-2xl border border-red-100 dark:border-red-500/20 text-center">
            <p className="text-red-500 text-sm font-semibold">{error}</p>
          </div>
        )}

        {!loading && !error && clubs.length === 0 && (
          <div className="py-20 text-center px-6">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">No chats yet</p>
            <p className="text-slate-400 text-sm">Join a club chat from the club profile page.</p>
          </div>
        )}

        {!loading && clubs.length > 0 && (
          <div className="divide-y divide-slate-100 dark:divide-slate-900">
            {clubs.map((club) => (
              <Link
                key={club._id}
                to={`/chats/${club._id}`}
                className="flex items-center gap-3 px-4 py-4 hover:bg-slate-50 dark:hover:bg-slate-950/30 transition-colors"
              >
                {club.profilePhoto ? (
                  <img
                    src={getAvatarUrl(club.profilePhoto)}
                    alt={club.name}
                    className="h-12 w-12 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center font-semibold uppercase text-white">
                    {club.name?.[0] || club.username?.[0] || "C"}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 dark:text-white truncate">
                    {club.clubName || club.name || club.username}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    @{club.username}{user?.userType === "club" && String(user?._id) === String(club?._id) ? " • Your club" : ""}
                  </div>
                </div>

                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }, [authLoading, user, loading, error, clubs, fetchChats]);

  return content;
}
