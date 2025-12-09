import axios from "../api/axios";
import { useContext, useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Home() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/post/all");
      setPosts(res.data.posts || []);
    } catch {
      setError("Could not load posts, try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchPosts();
  }, [user]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-emerald-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-6">
        <h1 className="text-5xl font-extrabold text-white tracking-tight">
          Explore <span className="text-emerald-500">Campus Events</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mt-4">
          Sign in to create, discover, and bookmark activities around campus.
        </p>
        <Link
          to="/login"
          className="mt-8 px-10 py-4 rounded-2xl bg-emerald-600 text-white font-bold shadow-xl hover:scale-105 transition-all"
        >
          Get Started
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-fade-in">

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* FEED AREA */}
        <div className="lg:col-span-2 space-y-6">

          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse h-40 bg-slate-800/50 rounded-2xl border border-slate-700"
                />
              ))}
            </div>
          )}

          {error && (
            <div className="bg-rose-800/40 border border-rose-700 text-rose-300 p-4 rounded-xl">
              {error}
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="bg-slate-900/40 border border-slate-700 p-16 text-center rounded-2xl shadow-xl">
              <p className="text-2xl text-white font-bold mb-2">No posts yet</p>
              <p className="text-slate-400">Be the first to share something.</p>
            </div>
          )}

          {posts.map((post, index) => (
            <div
              key={post._id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <PostCard post={post} onRefresh={fetchPosts} />
            </div>
          ))}

        </div>

        {/* SIDEBAR */}
        <aside className="hidden lg:flex flex-col gap-6 sticky top-24 h-fit">

          <div className="bg-slate-900/40 border border-slate-700 rounded-2xl shadow-xl p-6 text-center">
            <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
              {user.name?.[0] || user.username?.[0]}
            </div>
            <h2 className="text-xl font-bold text-white mt-3">{user.name}</h2>
            <p className="text-slate-400">@{user.username}</p>
          </div>

          <button
            onClick={() => setShowCreate(true)}
            className="py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold hover:scale-105 shadow-xl transition-all"
          >
            + Create Post
          </button>
        </aside>

      </div>

      {/* Floating Create Button Mobile */}
      <button
        className="lg:hidden fixed bottom-6 right-6 h-16 w-16 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-3xl shadow-2xl flex items-center justify-center"
        onClick={() => setShowCreate(true)}
      >
        +
      </button>

      {/* MODAL FOR CREATE POST */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900/70 border border-slate-700 rounded-2xl p-6 max-w-xl w-full shadow-xl">
            <CreatePost
              onPostCreated={() => {
                fetchPosts();
                setShowCreate(false);
              }}
            />
            <button
              onClick={() => setShowCreate(false)}
              className="text-slate-300 mt-4 hover:text-white transition-all"
            >
              Close ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
