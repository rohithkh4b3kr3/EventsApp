import { useContext, useEffect, useMemo, useState } from "react";
import axios from "../api/axios";
import PostCard from "../components/PostCard";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams, Link } from "react-router-dom";

export default function Profile() {
  const { id } = useParams();
  const { user: loggedInUser, refreshUser } = useContext(AuthContext);
  const profileId = useMemo(() => id || loggedInUser?._id, [id, loggedInUser?._id]);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [followLoading, setFollowLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

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
    if (loggedInUser?.following && user?._id) {
      const following = loggedInUser.following.some(
        (id) => id.toString() === user._id.toString()
      );
      setIsFollowing(following);
    }
  }, [loggedInUser?.following, user?._id]);

  const handleFollowToggle = async () => {
    if (!user || !loggedInUser || loggedInUser._id === user._id) return;
    setFollowLoading(true);
    try {
      const response = await axios.post(`/user/togglefollow/${user._id}`);
      if (response.data.success) {
        await refreshUser();
        setIsFollowing(!isFollowing);
        await fetchProfile();
      }
    } catch (err) {
      console.error("Follow error:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  useEffect(() => {
    if (!profileId && !loggedInUser) navigate("/login");
    else fetchProfile();
  }, [profileId]);

  return (
    <div className="max-w-[600px] mx-auto border-x border-slate-200 dark:border-slate-800 min-h-full">
      {loading && (
        <div className="text-center py-20">
          <div className="animate-spin h-8 w-8 border-2 border-slate-300 dark:border-slate-700 border-t-emerald-500 rounded-full mx-auto mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Loading profile...</p>
        </div>
      )}

      {error && (
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="text-red-500 text-sm font-medium">{error}</div>
        </div>
      )}

      {user && (
        <>
          {/* Header */}
          <div className="h-48 bg-slate-200 dark:bg-slate-900 relative">
            <div className="absolute -bottom-16 left-4">
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-3xl text-white font-bold uppercase border-4 border-white dark:border-black">
                {user.name?.[0] || "U"}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 px-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex justify-end mb-3">
              {loggedInUser?._id === user._id ? (
                <Link
                  to="/favorites"
                  className="px-4 h-9 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-[15px] flex items-center"
                >
                  Favorites
                </Link>
              ) : loggedInUser ? (
                <button
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  className={`px-4 h-9 rounded-full font-bold transition-all text-[15px] ${
                    isFollowing
                      ? "border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:border-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-slate-200"
                  } disabled:opacity-50`}
                >
                  {followLoading ? "..." : isFollowing ? "Following" : "Follow"}
                </button>
              ) : null}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {user.name ?? user.username ?? "Unknown User"}
              </h1>
              <p className="text-[15px] text-slate-500 dark:text-slate-400">@{user.username}</p>
              {user.userType === 'club' && (
                <span className="inline-block mt-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-full">
                  Club Account
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-4 mt-4 text-[15px]">
              <Link 
                to={`/profile/${user._id}`}
                className="hover:underline"
              >
                <span className="font-bold text-slate-900 dark:text-white">{posts.length}</span>
                <span className="text-slate-500 dark:text-slate-400 ml-1">Posts</span>
              </Link>
              <span>
                <span className="font-bold text-slate-900 dark:text-white">{user.followers?.length || 0}</span>
                <span className="text-slate-500 dark:text-slate-400 ml-1">Followers</span>
              </span>
              <span>
                <span className="font-bold text-slate-900 dark:text-white">{user.following?.length || 0}</span>
                <span className="text-slate-500 dark:text-slate-400 ml-1">Following</span>
              </span>
            </div>
          </div>

          {/* Posts */}
          <div>
            {posts.length === 0 ? (
              <div className="p-12 text-center border-b border-slate-200 dark:border-slate-800">
                <p className="text-slate-500 dark:text-slate-400 text-lg mb-2">No posts yet</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm">Start sharing events to see them here!</p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard key={post._id} post={post} onRefresh={fetchProfile} />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
