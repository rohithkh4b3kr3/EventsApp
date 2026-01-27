import { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContextContext";
import IITMLogo from "../assets/iitm.png";
import SearchBar from "./SearchBar";

export default function LeftSidebar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const getAvatarUrl = (photoPath) => {
    if (!photoPath) return "";
    if (photoPath.startsWith("http")) return photoPath;
    const base = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/api$/, "");
    return `${base}${photoPath}`;
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = user
    ? [
        { path: "/", label: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
        { path: "/chats", label: "Chats", icon: "M7 8h10M7 12h6m-7 8l-4-4V5a2 2 0 012-2h16a2 2 0 012 2v11a2 2 0 01-2 2H8l-4 4z" },
        { path: "/calendar", label: "Calendar", icon: "M8 7V3m8 4V3M5 11h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
        { path: "/following", label: "Following", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
        { path: "/favorites", label: "Favorites", icon: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" },
        { path: `/profile/${user._id}`, label: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
        { path: "/settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
      ]
    : [
        { path: "/login", label: "Login", icon: "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" },
        { path: "/register", label: "Register", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
      ];

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-[275px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-black z-50">
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
      >
        <img
          src={IITMLogo}
          alt="IITM Logo"
          className="h-10 w-10 rounded-lg object-cover"
        />
        <div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            InstiEvents
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">IIT Madras</p>
        </div>
      </Link>

      {/* Search Bar */}
      {user && (
        <div className="px-3 py-2">
          <SearchBar />
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3 rounded-full transition-colors group ${
              isActive(item.path)
                ? "font-bold"
                : "font-normal"
            } ${
              isActive(item.path)
                ? "text-slate-900 dark:text-white"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
            }`}
          >
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={isActive(item.path) ? 2.5 : 2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
            </svg>
            <span className="text-[20px]">{item.label}</span>
          </Link>
        ))}

        {user?.userType === "club" && (
          <button
            onClick={() => {
              const event = new CustomEvent('openCreatePost');
              window.dispatchEvent(event);
            }}
            className="w-full mt-2 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-colors text-[17px] shadow-sm"
          >
            Post
          </button>
        )}
      </nav>

      {/* Profile Section at Bottom */}
      {user && (
        <div className="mt-auto p-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-[17px] font-medium">Logout</span>
          </button>

          <Link
            to={`/profile/${user._id}`}
            className="flex items-center gap-3 px-4 py-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors mt-1"
          >
            {user?.profilePhoto ? (
              <img
                src={getAvatarUrl(user.profilePhoto)}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-800 flex-shrink-0"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center font-semibold uppercase text-white text-sm flex-shrink-0">
                {user.name?.[0] || user.username?.[0] || "U"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
              <p className="text-[15px] text-slate-500 dark:text-slate-400 truncate">@{user.username}</p>
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
}
