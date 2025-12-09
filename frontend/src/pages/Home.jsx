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

  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/post/all");
      setPosts(res.data.posts || []);
    } catch (err) {
      setError("Unable to load events. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchPosts();
    else setPosts([]);
  }, [user]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] animate-pulse text-slate-500">
        Preparing your feed...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-md border border-slate-100 p-10 text-center">
          <p className="text-sm uppercase tracking-wide text-emerald-600 font-semibold">
            IITM Events
          </p>
          <h1 className="text-4xl font-extrabold text-slate-900 leading-tight mt-3">
            Share & discover campus events <br /> all in one place.
          </h1>
          <p className="text-slate-600 mt-4 text-lg">
            Host workshops, meetups, competitions and more. Join now to create, like, and bookmark events.
          </p>

          <div className="flex gap-4 justify-center mt-8">
            <Link
              to="/register"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg transition font-medium"
            >
              Create your account
            </Link>
            <Link
              to="/login"
              className="border border-slate-300 px-6 py-3 rounded-xl text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition font-medium"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-6 mb-12 space-y-6 px-4">
      <CreatePost onPostCreated={fetchPosts} />

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-white h-28 rounded-xl border border-slate-200 shadow-sm"
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-rose-50 text-rose-700 border border-rose-200 rounded-xl p-4 shadow-sm flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={fetchPosts}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && posts.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm">
          <p className="text-xl font-semibold text-slate-800">
            No events posted yet 👀
          </p>
          <p className="text-slate-500 mt-2">Be the first to share something!</p>
        </div>
      )}

      {/* Posts */}
      {posts.map((post) => (
        <PostCard key={post._id} post={post} onRefresh={fetchPosts} />
      ))}
    </div>
  );
}
