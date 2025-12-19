import axios from "../api/axios";
import { useContext, useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Following() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFollowingPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/post/following`);
      setPosts(res.data.posts || []);
      if (res.data.posts?.length === 0) {
        setError("No posts from people you follow yet. Start following users to see their posts here!");
      }
    } catch {
      setError("Could not load posts from following, try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFollowingPosts();
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-2 border-slate-300 dark:border-slate-700 border-t-emerald-500 rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-6">
        <h1 className="text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
          Follow Events
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-xl max-w-xl mb-8">
          Sign in to see posts from users you follow.
        </p>
        <Link
          to="/login"
          className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full transition-colors"
        >
          Get Started
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto border-x border-slate-200 dark:border-slate-800 min-h-full">
      {/* Header */}
      <div className="sticky top-[73px] lg:top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 py-3">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Following</h1>
        <p className="text-[15px] text-slate-500 dark:text-slate-400 mt-1">Posts from people you follow</p>
      </div>

      {loading && (
        <div className="space-y-0">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse border-b border-slate-200 dark:border-slate-800 p-4"
            >
              <div className="flex gap-3">
                <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className={`p-12 text-center border-b border-slate-200 dark:border-slate-800 ${
          !error.includes("No posts") && "bg-red-50 dark:bg-red-950/20"
        }`}>
          <p className={`text-lg font-medium mb-2 ${
            error.includes("No posts") 
              ? "text-slate-500 dark:text-slate-400" 
              : "text-red-500"
          }`}>
            {error.includes("No posts") ? "No Posts Yet" : "Error"}
          </p>
          <p className={`text-sm ${
            error.includes("No posts") 
              ? "text-slate-400 dark:text-slate-500" 
              : "text-red-400"
          }`}>
            {error}
          </p>
          {error.includes("No posts") && (
            <Link
              to="/"
              className="inline-block mt-6 px-6 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors text-sm"
            >
              Explore Posts
            </Link>
          )}
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onRefresh={fetchFollowingPosts} />
          ))}
        </div>
      )}
    </div>
  );
}
