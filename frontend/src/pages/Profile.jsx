import { useContext, useEffect, useMemo, useState } from "react";
import axios from "../api/axios";
import PostCard from "../components/PostCard";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams, Link } from "react-router-dom";

export default function Profile() {
  const { id } = useParams();
  const { user: loggedInUser } = useContext(AuthContext);
  const profileId = useMemo(() => id || loggedInUser?._id, [id, loggedInUser?._id]);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    if (!profileId) return;
    setLoading(true);
    try {
      const res = await axios.get(`/user/profile/${profileId}`);
      setUser(res.data.user);
      setPosts(res.data.posts || []);
    } catch (err) {
      setError("Could not load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!profileId && !loggedInUser) navigate("/login");
    else fetchProfile();
  }, [profileId]);

  return (
    <div className="max-w-4xl mx-auto mt-10 mb-16 px-4 animate-slide-up">

      {/* Loading */}
      {loading && (
        <div className="text-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400 font-semibold">Loading profile...</p>
        </div>
      )}

      {error && (
        <div className="bg-rose-900/40 text-rose-300 border border-rose-700 rounded-2xl p-5 shadow-lg mb-6 font-semibold text-center">
          {error}
        </div>
      )}

      {user && (
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-700 rounded-3xl p-8 shadow-xl mb-8 relative">

          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-3xl text-white font-bold uppercase shadow-lg">
              {user.name?.[0] || "U"}
            </div>

            <div>
              <h1 className="text-3xl font-extrabold text-white">
                {user.name ?? user.username ?? "Unknown User"}
              </h1>
              <p className="text-slate-400 mt-1">@{user.username}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-6">
            <div className="px-6 py-3 bg-slate-800/40 rounded-xl border border-slate-700 text-center">
              <p className="text-2xl font-bold text-emerald-400">{posts.length}</p>
              <p className="text-xs text-slate-400 tracking-wide">Posts</p>
            </div>

            {loggedInUser?._id === user._id && (
              <Link
                to="/favorites"
                className="px-6 py-3 bg-emerald-600/20 text-emerald-300 border border-emerald-600 rounded-xl font-semibold text-sm shadow-md hover:bg-emerald-500/30 transition-all"
              >
                ⭐ Favorites
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Posts */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-700 p-12 rounded-2xl text-center shadow-lg">
            <p className="text-xl font-bold text-slate-200 mb-2">No posts yet</p>
            <p className="text-slate-400">Start sharing events to see them here!</p>
          </div>
        ) : (
          posts.map((post, i) => (
            <div key={post._id} style={{ animationDelay: `${i * 0.1}s` }}>
              <PostCard post={post} onRefresh={fetchProfile} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
