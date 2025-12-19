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

  useEffect(() => {
    const handleOpenCreatePost = () => {
      setShowCreate(true);
    };
    window.addEventListener('openCreatePost', handleOpenCreatePost);
    return () => window.removeEventListener('openCreatePost', handleOpenCreatePost);
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/post/all");
      console.log("Posts response:", res.data); // Debug log
      if (res.data && res.data.success !== false) {
        const postsArray = res.data.posts || res.data || [];
        console.log("Setting posts:", postsArray); // Debug log
        setPosts(Array.isArray(postsArray) ? postsArray : []);
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      console.error("Error details:", err.response?.data);
      setError(err.response?.data?.msg || err.response?.data?.message || "Could not load posts, try again later.");
      setPosts([]);
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
        <div className="animate-spin h-8 w-8 border-2 border-slate-300 dark:border-slate-700 border-t-emerald-500 rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-6">
        <h1 className="text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
          Events Hub
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-xl max-w-xl mb-8">
          Join the campus community. Share events. Connect with clubs.
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
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Home</h1>
      </div>

      {/* Create Post Section */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <CreatePost onPostCreated={fetchPosts} />
      </div>

      {/* Feed */}
      <div>
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
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="text-red-500 text-sm font-medium">{error}</div>
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="p-12 text-center border-b border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400 text-lg mb-2">No posts yet</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm">Be the first to share something.</p>
          </div>
        )}

        {posts.length > 0 && posts.map((post) => {
          if (!post || !post._id) return null;
          return <PostCard key={post._id} post={post} onRefresh={fetchPosts} />;
        })}
      </div>

      {/* Floating Create Button Mobile */}
      <button
        className="lg:hidden fixed bottom-20 right-5 h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg flex items-center justify-center transition-colors z-40"
        onClick={() => setShowCreate(true)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* MODAL FOR CREATE POST */}
      {showCreate && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowCreate(false)}
        >
          <div 
            className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowCreate(false)}
                className="h-9 w-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <CreatePost
                onPostCreated={() => {
                  fetchPosts();
                  setShowCreate(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
