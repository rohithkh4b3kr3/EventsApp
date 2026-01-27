import axios from "../api/axios";
import { useContext, useEffect, useState, useCallback } from "react";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";
import { AuthContext } from "../context/AuthContextContext";
import { Link } from "react-router-dom";

export default function Home() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const fetchPosts = useCallback(async (isInitial = true) => {
    if (isInitial) setLoading(true);
    setError("");
    try {
      const res = await axios.get("/post/all");
      if (res.data && res.data.success !== false) {
        const postsArray = res.data.posts || res.data || [];
        setPosts(Array.isArray(postsArray) ? postsArray : []);
      }
    } catch (err) {
      setError("Could not load posts. Swipe down to retry.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchPosts();
    
    const handleOpenCreatePost = () => setShowCreate(true);
    window.addEventListener('openCreatePost', handleOpenCreatePost);
    return () => window.removeEventListener('openCreatePost', handleOpenCreatePost);
  }, [user, fetchPosts]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-black">
        <div className="relative">
          <div className="h-12 w-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[90vh] text-center px-6">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-6">
           <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
           </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
          InstiEvents
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-sm mb-10 leading-relaxed">
          The heartbeat of your campus. Discover events, clubs, and people.
        </p>
        <Link
          to="/login"
          className="w-full max-w-xs py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
        >
          Get Started
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[650px] mx-auto border-x border-slate-100 dark:border-slate-900 min-h-screen pb-24 lg:pb-8 bg-white dark:bg-black">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-30 bg-white/70 dark:bg-black/70 backdrop-blur-md border-b border-slate-100 dark:border-slate-900 px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Home</h1>
        <button 
          onClick={() => fetchPosts(false)}
          className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors ${loading ? 'animate-spin' : ''}`}
        >
          <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </header>

      {/* Desktop Inline Create - Hidden on Mobile to save space */}
      <div className="hidden md:block border-b border-slate-100 dark:border-slate-900">
        <CreatePost onPostCreated={() => fetchPosts(false)} />
      </div>

      {/* Feed Area */}
      <div className="divide-y divide-slate-100 dark:divide-slate-900">
        {loading && (
          <div className="divide-y divide-slate-100 dark:divide-slate-900">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 animate-pulse">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-900"></div>
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-3 bg-slate-100 dark:bg-slate-900 rounded w-1/3"></div>
                    <div className="h-20 bg-slate-100 dark:bg-slate-900 rounded-xl w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="m-4 p-4 bg-red-50 dark:bg-red-500/10 rounded-2xl border border-red-100 dark:border-red-500/20 text-center">
            <p className="text-red-500 text-sm font-semibold">{error}</p>
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="py-20 text-center px-6">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Your feed is quiet</p>
            <p className="text-slate-400 text-sm">Be the one to spark the conversation.</p>
          </div>
        )}

        {posts.map((post) => (
          post?._id && <PostCard key={post._id} post={post} onRefresh={() => fetchPosts(false)} />
        ))}
      </div>

      {/* Modern Floating Action Button - Mobile Only */}
      <button
        className="md:hidden fixed bottom-6 right-6 h-16 w-16 rounded-2xl bg-emerald-500 text-white shadow-2xl shadow-emerald-500/40 flex items-center justify-center transition-transform active:scale-90 z-40"
        onClick={() => setShowCreate(true)}
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Mobile-Friendly Full Screen Modal */}
      {showCreate && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4"
          onClick={() => setShowCreate(false)}
        >
          <div 
            className="bg-white dark:bg-black rounded-t-[2.5rem] md:rounded-3xl max-w-xl w-full shadow-2xl animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Handle for Mobile */}
            <div className="md:hidden flex justify-center pt-3 pb-1">
               <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
            </div>
            
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-50 dark:border-slate-900">
              <span className="font-bold text-lg dark:text-white">Create Post</span>
              <button
                onClick={() => setShowCreate(false)}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 max-h-[80vh] overflow-y-auto">
              <CreatePost
                onPostCreated={() => {
                  fetchPosts(false);
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