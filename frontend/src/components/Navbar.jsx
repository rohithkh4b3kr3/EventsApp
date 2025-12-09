import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import IITMLogo from "../assets/iitm.png";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="w-full px-5 md:px-10 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-2xl bg-slate-900/60 border-b border-slate-800 shadow-xl">

      {/* Brand */}
      <Link to="/" className="flex items-center gap-3 group select-none">
        <div className="relative">
          <img
            src={IITMLogo}
            alt="IITM Logo"
            className="h-10 w-10 rounded-xl object-cover shadow-md transition-all duration-300 group-hover:scale-110"
          />
        </div>

        <div>
          <p className="text-xl font-extrabold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent tracking-tight">
            Events Hub
          </p>
          <p className="text-[11px] text-slate-400 tracking-wider font-medium -mt-1">IIT Madras</p>
        </div>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-1 text-sm font-medium">

        <Link
          to="/"
          className="px-4 py-2 rounded-xl text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-200"
        >
          Home
        </Link>

        {user && (
          <>
            <Link
              to="/favorites"
              className="px-4 py-2 rounded-xl text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-200"
            >
              Favorites
            </Link>

            <Link
              to={`/profile/${user._id}`}
              className="px-4 py-2 rounded-xl text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-200"
            >
              Profile
            </Link>

            <Link
              to="/settings"
              className="px-4 py-2 rounded-xl text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-200"
            >
              Settings
            </Link>
          </>
        )}

        {user ? (
          <>
            {/* Avatar */}
            <div className="flex items-center gap-2 ml-3 px-3 py-1.5 bg-slate-800/60 rounded-2xl border border-slate-700 shadow-md">
              <span className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center font-bold uppercase">
                {user.name?.[0] || user.username?.[0] || "U"}
              </span>
              <p className="text-slate-300 font-semibold hidden lg:block">
                {user.name}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-900/20 transition-all duration-200 shadow-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-200"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="ml-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold shadow-md hover:scale-105 hover:shadow-lg transition-all"
            >
              Get Started
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800/60 transition-all"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor">
          {menuOpen ? (
            <path strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 mx-4 mt-3 p-4 flex flex-col gap-2 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl animate-slide-up">
          <Link to="/" onClick={() => setMenuOpen(false)} className="px-4 py-2 rounded-xl text-slate-300 hover:bg-emerald-600/20 transition-all">
            Home
          </Link>

          {user ? (
            <>
              <Link to="/favorites" onClick={() => setMenuOpen(false)} className="px-4 py-2 rounded-xl text-slate-300 hover:bg-emerald-600/20 transition-all">
                Favorites
              </Link>
              <Link to={`/profile/${user._id}`} onClick={() => setMenuOpen(false)} className="px-4 py-2 rounded-xl text-slate-300 hover:bg-emerald-600/20 transition-all">
                Profile
              </Link>
              <Link to="/settings" onClick={() => setMenuOpen(false)} className="px-4 py-2 rounded-xl text-slate-300 hover:bg-emerald-600/20 transition-all">
                Settings
              </Link>
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-emerald-400 hover:border-emerald-500 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="px-4 py-2 rounded-xl text-slate-300 hover:bg-emerald-600/20 transition-all">
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold text-center">
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
