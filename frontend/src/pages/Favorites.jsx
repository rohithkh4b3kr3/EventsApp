import { useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import PostCard from "../components/PostCard";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Favorites() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookmarkedPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/post/bookmarked");
      setPosts(res.data.posts || []);
    } catch (err) {
      setError("Failed to load favorites.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchBookmarkedPosts();
    else setLoading(false);
  }, [user]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin h-10 w-10 border-4 border-emerald-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white bg-clip-text leading-tight">
          Sign in to view Favorites
        </h1>
        <p className="text-slate-400 mt-4 text-lg font-medium">
          Save posts to access them anytime.
        </p>
        <Link
          to="/login"
          className="mt-8 px-10 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold shadow-xl hover:scale-105 transition-all"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in space-y-8">

      {/* HEADER */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl p-8 flex items-center gap-6">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-xl">
          <span className="text-3xl text-white">⭐</span>
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Favorites</h1>
          <p className="text-slate-400 font-medium">Your saved posts</p>
        </div>
      </div>

      {/* LOADING SKELETON */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="animate-pulse bg-slate-800/50 h-36 rounded-2xl border border-slate-700"
            />
          ))}
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="bg-rose-900/40 border border-rose-700 text-rose-300 rounded-xl p-5 shadow-lg flex justify-between">
          <span className="font-semibold">{error}</span>
          <button
            onClick={fetchBookmarkedPosts}
            className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold hover:scale-105 transition-all"
          >
            Retry
          </button>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && posts.length === 0 && (
        <div className="bg-slate-900/40 border border-slate-800 backdrop-blur-xl p-14 rounded-3xl shadow-xl text-center">
          <p className="text-3xl font-extrabold text-white mb-3">No Favorites Yet</p>
          <p className="text-slate-400 text-lg mb-6">Bookmark posts to see them here.</p>
          <Link
            to="/"
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold hover:scale-105 transition-all"
          >
            Browse Posts →
          </Link>
        </div>
      )}

      {/* POSTS */}
      <div className="space-y-6">
        {posts.map((post, index) => (
          <div
            key={post._id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <PostCard post={post} onRefresh={fetchBookmarkedPosts} />
          </div>
        ))}
      </div>
    </div>
  );
}
