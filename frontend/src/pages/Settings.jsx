import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
    <div className="max-w-4xl mx-auto mt-10 mb-16 px-4 animate-slide-up">
      <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl p-8 md:p-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1v22M1 12h22" />
            </svg>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Settings</h1>
            <p className="text-slate-400 text-sm mt-1">Manage your account & preferences</p>
          </div>
        </div>

        {/* Account Section */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Account</h2>
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 flex items-center justify-between">
            <div>
              <p className="font-semibold text-white text-lg">{user?.name}</p>
              <p className="text-slate-400 text-sm">@{user?.username}</p>
            </div>
            <button
              onClick={() => navigate(`/profile/${user?._id}`)}
              className="px-5 py-2 rounded-xl border border-slate-600 text-slate-300 hover:border-emerald-500 hover:text-emerald-400 transition-all"
            >
              View Profile
            </button>
          </div>
        </section>

        {/* Notification Section */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Notifications</h2>
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 space-y-5">

            {[
              { key: "email", title: "Email Notifications", desc: "Receive updates via email" },
              { key: "push", title: "Push Notifications", desc: "Enable browser notifications" },
              { key: "events", title: "Event Updates", desc: "Get notified when new events go live" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
                <button
                  onClick={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all ${
                    notifications[item.key] ? "bg-emerald-600" : "bg-slate-500"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 rounded-full bg-white transform transition-transform ${
                      notifications[item.key] ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Privacy</h2>
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 space-y-5">

            <div>
              <label className="font-semibold text-white block mb-2">Profile Visibility</label>
              <select
                value={privacy.profileVisibility}
                onChange={(e) => setPrivacy((prev) => ({ ...prev, profileVisibility: e.target.value }))}
                className="w-full bg-slate-900/40 border border-slate-700 text-white p-3 rounded-xl focus:border-emerald-500 outline-none"
              >
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Show Email</p>
                <p className="text-slate-400 text-sm">Display your email publicly</p>
              </div>

              <button
                onClick={() => setPrivacy((prev) => ({ ...prev, showEmail: !prev.showEmail }))}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all ${
                  privacy.showEmail ? "bg-emerald-600" : "bg-slate-500"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 rounded-full bg-white transform transition-transform ${
                    privacy.showEmail ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section>
          {/* <h2 className="text-xl font-bold text-white mb-4">Danger Zone</h2> */}
          <div className="bg-rose-900/30 border border-rose-700 rounded-2xl p-6 flex items-center justify-between">
            <div>
              <p className="font-semibold text-rose-200">Logout</p>
              <p className="text-sm text-rose-300">Sign out from Events Hub</p>
            </div>

            <button
              onClick={handleLogout}
              disabled={loading}
              className="bg-gradient-to-r from-rose-600 to-rose-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:scale-105 transition-all disabled:opacity-60"
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
