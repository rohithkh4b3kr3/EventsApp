import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Settings() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    events: true,
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
  });

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto border-x border-slate-200 dark:border-slate-800 min-h-full">
      {/* Header */}
      <div className="sticky top-[73px] lg:top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 py-3">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h1>
      </div>

      <div className="p-4 space-y-8">
        {/* Account Section */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Account</h2>
          <div className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center font-semibold uppercase text-white text-sm">
                  {user?.name?.[0] || user?.username?.[0] || "U"}
                </div>
                <div>
                  <p className="font-bold text-[15px] text-slate-900 dark:text-white">{user?.name}</p>
                  <p className="text-[15px] text-slate-500 dark:text-slate-400">@{user?.username}</p>
                </div>
              </div>
              <Link
                to={`/profile/${user?._id}`}
                className="px-4 h-9 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-sm flex items-center"
              >
                View Profile
              </Link>
            </div>
          </div>
        </section>

        {/* Notification Section */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Notifications</h2>
          <div className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            {[
              { key: "email", title: "Email Notifications", desc: "Receive updates via email" },
              { key: "push", title: "Push Notifications", desc: "Enable browser notifications" },
              { key: "events", title: "Event Updates", desc: "Get notified about new events" },
            ].map((item, index) => (
              <div
                key={item.key}
                className={`flex items-center justify-between p-4 ${
                  index !== 2 ? "border-b border-slate-200 dark:border-slate-800" : ""
                }`}
              >
                <div>
                  <p className="font-semibold text-[15px] text-slate-900 dark:text-white">{item.title}</p>
                  <p className="text-[15px] text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
                <button
                  onClick={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    notifications[item.key] ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 rounded-full bg-white transform transition-transform ${
                      notifications[item.key] ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Privacy</h2>
          <div className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <label className="font-semibold text-[15px] text-slate-900 dark:text-white block mb-2">
                Profile Visibility
              </label>
              <select
                value={privacy.profileVisibility}
                onChange={(e) => setPrivacy((prev) => ({ ...prev, profileVisibility: e.target.value }))}
                className="w-full bg-white dark:bg-black border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-[15px]"
              >
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold text-[15px] text-slate-900 dark:text-white">Show Email</p>
                <p className="text-[15px] text-slate-500 dark:text-slate-400">Display your email publicly</p>
              </div>
              <button
                onClick={() => setPrivacy((prev) => ({ ...prev, showEmail: !prev.showEmail }))}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  privacy.showEmail ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 rounded-full bg-white transform transition-transform ${
                    privacy.showEmail ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Logout */}
        <section>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="w-full bg-white dark:bg-black border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 py-3 rounded-full font-bold text-[15px] transition-colors disabled:opacity-50"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </section>
      </div>
    </div>
  );
}
