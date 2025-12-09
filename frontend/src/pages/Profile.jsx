import { useContext, useEffect, useMemo, useState } from "react";
import axios from "../api/axios";
import PostCard from "../components/PostCard";
import UserCard from "../components/UserCard";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

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
    if (!profileId) {
      setError("No profile selected");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`/user/profile/${profileId}`);
      setUser(res.data.user);
      setPosts(res.data.posts || []);
    } catch (err) {
      setError(err.friendlyMessage || "Could not load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!profileId && !loggedInUser) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [profileId]);

  return (
    <div className="max-w-3xl mx-auto mt-8 mb-12">
      {loading && (
        <div className="bg-white rounded-xl border border-slate-100 p-4 text-slate-600 shadow-sm mb-4">
          Loading profile...
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 rounded-xl p-4 shadow-sm mb-4">
          {error}
        </div>
      )}

      {user && (
        <UserCard user={user} isCurrentUser={loggedInUser?._id === user._id} onRefresh={fetchProfile} />
      )}

      <div className="mt-6">
        {posts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-100 p-6 text-slate-600 text-center shadow-sm">
            No posts yet.
          </div>
        ) : (
          posts.map((p) => <PostCard key={p._id} post={p} onRefresh={fetchProfile} />)
        )}
      </div>
    </div>
  );
}
